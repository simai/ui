import {html, nothing} from "lit";

function joinClasses(...tokens) {
    return tokens.flat().filter(Boolean).join(" ");
}


function renderItem(item) {
    if (item?.component === "sf-button") {
        const props = item.props || {};
        const click = props["@click"];

        return html`
            <sf-button
                    type=${props.type || "default"}
                    scheme=${props.scheme || "primary"}
                    size=${props.size || "1"}
                    text=${props.text || ""}
                    icon-left=${props.iconLeft || ""}
                    icon-right=${props.iconRight || ""}
                    aria-label=${props.ariaLabel || props.text || nothing}
                    ?disabled=${Boolean(props.disabled)}
                    @click=${typeof click === "function" ? click : nothing}
            ></sf-button>
        `;
    }

    return SF.litHtml(item.component, item.props);
}

function renderItems(items) {
    return html`
        ${items.map(renderItem)}
    `
}

// The standard menu: entries are data, not components. An item is a row with
// an optional icon, a label and caption, and at its end a value, a shortcut, a
// check or a submenu chevron; a separator is a rule; a heading names the group
// of items under it. The row geometry is the profile menu's (owner, 2026-10-12):
// as tall as a size-1/2 field, its content on the field's axis.
const ROLE = {check: "menuitemcheckbox", radio: "menuitemradio"};

function icon(name, className) {
    return html`<i class="sf-icon ${className}" aria-hidden="true">${name}</i>`;
}

function renderEntry(entry, index, lead) {
    if (entry?.type === "separator") {
        return html`<div class="sf-context-menu-separator" role="separator"></div>`;
    }
    if (entry?.type === "heading") {
        return html`<div class="sf-context-menu-heading" role="presentation">${entry.text ?? ""}</div>`;
    }
    const role = ROLE[entry.kind] ?? "menuitem";
    const checkable = role !== "menuitem";
    const submenu = Array.isArray(entry.submenu) && entry.submenu.length > 0;
    const classes = joinClasses(
        "sf-context-menu-item",
        entry.danger ? "sf-context-menu-item--danger" : "",
        entry.current ? "sf-context-menu-item--current" : "",
    );
    const body = html`
        ${lead ? html`<span class="sf-context-menu-item-lead">${entry.icon ? icon(entry.icon, "sf-context-menu-item-icon") : nothing}</span>` : nothing}
        <span class="sf-context-menu-item-text">
            <span class="sf-context-menu-item-label">${entry.text ?? ""}</span>
            ${entry.caption ? html`<span class="sf-context-menu-item-caption">${entry.caption}</span>` : nothing}
        </span>
        ${entry.value ? html`<span class="sf-context-menu-item-value">${entry.value}</span>` : nothing}
        ${entry.shortcut ? html`<kbd class="sf-context-menu-item-shortcut">${entry.shortcut}</kbd>` : nothing}
        ${checkable ? html`<span class="sf-context-menu-item-check">${entry.checked ? icon("check", "") : nothing}</span>` : nothing}
        ${submenu ? icon("chevron_right", "sf-context-menu-item-chevron") : nothing}
    `;
    if (entry.href && !submenu && !entry.disabled) {
        return html`<a class=${classes} href=${entry.href} role=${role} data-sf-entry=${index}>${body}</a>`;
    }
    return html`<button
            type="button"
            class=${classes}
            role=${role}
            data-sf-entry=${index}
            aria-checked=${checkable ? String(Boolean(entry.checked)) : nothing}
            aria-haspopup=${submenu ? "menu" : nothing}
            aria-expanded=${submenu ? "false" : nothing}
            ?disabled=${Boolean(entry.disabled)}
    >${body}</button>`;
}

function renderEntries(entries) {
    // One leading column for the whole menu: when any item has an icon, every
    // item keeps the place, so the labels start on one line.
    const lead = entries.some((entry) => entry && entry.type !== "separator" && entry.type !== "heading" && entry.icon);
    return html`${entries.map((entry, index) => renderEntry(entry, index, lead))}`;
}

function renderContent(context) {
    if (context.entries && context.entries.length) {
        return renderEntries(context.entries);
    }
    if (context.items && context.items.length) {
        return renderItems(context.items);
        // console.log(items);
    }
    if (context.component?.hasSlotContent?.("content")) {
        return context.component.getSlotContent("content");
    }

    return context.text || nothing;
}

function renderTooltip(context) {
    if (!context.position || !context.tooltip) {
        return nothing;
    }

    if (context.component?.hasSlotContent?.("tooltip")) {
        return context.component.getSlotContent("tooltip");
    }

    return html`
        <div class="sf-context-menu-tooltip" aria-hidden="true"></div>`;
}

export function renderContextMenuTemplate(context) {
    const rootClasses = joinClasses(
        "sf-context-menu",
        context.position ? `sf-context-menu--position-${context.position}` : "",
        context.entries && context.entries.length ? "sf-context-menu--entries" : "",
        "flex",
        context.rootClass,
    );

    const contentClasses = joinClasses(
        "sf-context-menu-content",
        "flex",
        "flex-col",
        "flex-1",
        context.contentClass,
    );

    return html`
        <div
                class=${rootClasses}
                style=${context.rootStyle || nothing}
                role=${context.role || "menu"}
                aria-label=${context.ariaLabel || nothing}
        >
            <div class="relative">
                ${renderTooltip(context)}
                <div class=${contentClasses}>${renderContent(context)}</div>
            </div>
        </div>
    `;
}
