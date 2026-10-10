import {html, nothing} from 'lit';

function renderAction({icon, label, disabled, action, onClick}) {
  return html`
    <button
      type="button"
      class="sf-icon-button sf-icon-button--icon sf-icon-button--link sf-icon-button--on-surface sf-icon-button--size-1/2"
      data-action=${action}
      ?disabled=${disabled}
      aria-label=${label}
      @click=${onClick}
    >
      <i class="sf-icon" aria-hidden="true">${icon}</i>
    </button>
  `;
}

export function renderFilePreviewTemplate(context) {
  const rootClasses = [
    'sf-file-preview',
    context.surface ? 'sf-file-preview--surface' : '',
    context.disabled ? 'disabled' : '',
    context.rootClass,
  ].filter(Boolean);
  const hasActions = context.actions && (context.downloadAction || context.removeAction);

  return html`
    <div
      class=${rootClasses.join(' ')}
      style=${context.rootStyle || nothing}
      data-render-managed="1"
      role=${hasActions ? 'group' : nothing}
      aria-label=${hasActions ? context.ariaLabel : nothing}
      aria-disabled=${context.disabled ? 'true' : nothing}
    >
      <span class="sf-file-preview-holder">
        ${context.isImage
          ? html`<img class="sf-file-preview-thumbnail" src=${context.imageUrl || context.href} alt="">`
          : html`<i class="sf-icon" aria-hidden="true">${context.icon}</i>`}
      </span>
      <span class="sf-file-preview-main">
        <span class="sf-file-preview-name">${context.fileName}</span>
        ${context.fileSize
          ? html`<span class="sf-file-preview-size">${context.fileSize}</span>`
          : nothing}
      </span>
      ${hasActions
        ? html`
          <span class="sf-file-preview-actions">
            ${context.downloadAction
              ? renderAction({
                icon: 'download',
                label: context.downloadLabel,
                disabled: context.disabled,
                action: 'download',
                onClick: context.onDownload,
              })
              : nothing}
            ${context.removeAction
              ? renderAction({
                icon: 'delete',
                label: context.removeLabel,
                disabled: context.disabled,
                action: 'remove',
                onClick: context.onRemove,
              })
              : nothing}
          </span>
        `
        : nothing}
    </div>
  `;
}
