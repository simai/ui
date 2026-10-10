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

function renderContent(context) {
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
