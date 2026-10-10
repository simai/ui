import { html, nothing } from 'lit';

const SIZE_MAP = {
  tiny: '1/4',
  extra_small: '1/3',
  extraSmall: '1/3',
  small: '1/2',
  default: '',
  big: '2',
  extra_big: '3',
  extraBig: '3',
};

const PROFILE_CHECK_SIZE_MAP = {
  small: '3',
  big: '5',
};

function normalizeSize(value) {
  const normalized = String(value || '').trim();
  return SIZE_MAP[normalized] ?? normalized;
}

function roundClass(size) {
  const normalized = normalizeSize(size);
  return normalized ? `sf-avatar-round--${normalized}` : '';
}

function indicatorClass(size, prefix) {
  const normalized = normalizeSize(size);
  return normalized ? `${prefix}--${normalized}` : '';
}

function imageStyle(imageUrl) {
  return imageUrl ? `background-image: url(${imageUrl});` : nothing;
}

function checkIcon() {
  return html`<i class="sf-icon">check</i>`;
}

function renderDefaultTemplate(context) {
  const size = context.roundSize || context.avatarSize;
  const avatarClasses = [
    'sf-avatar',
    'sf-avatar-round',
    roundClass(size),
    context.rootClass,
  ].filter(Boolean);
  const activeClass = indicatorClass(size, 'sf-avatar-cir');
  const checkClass = indicatorClass(size, 'sf-avatar-check');

  return html`
    <div class=${avatarClasses.join(' ')} style=${context.rootStyle || nothing}>
      <button
        type="button"
        class="sf-avatar--image"
        style=${imageStyle(context.imageUrl)}
      >
        ${context.active
          ? html`<span
              class=${['sf-avatar-cir', 'sf-avatar-cir-green', activeClass]
                .filter(Boolean)
                .join(' ')}
            ></span>`
          : nothing}
        ${context.check
          ? html`<span
              class=${['sf-avatar-check', checkClass].filter(Boolean).join(' ')}
            >
              ${checkIcon()}
            </span>`
          : nothing}
      </button>
    </div>
  `;
}

function renderUserTemplate(context) {
  return html`
    <div class=${['sf-avatar', 'sf-avatar--user', context.rootClass]
      .filter(Boolean)
      .join(' ')} style=${context.rootStyle || nothing}>
      ${context.imageUrl ? html`<img src=${context.imageUrl} alt="" />` : nothing}
      <div class="sf-avatar--user-description">
        <span class="sf-avatar--name">${context.name}</span>
        <span class="sf-avatar--additional">
          <i class="sf-icon">link</i>
          <span>${context.source}</span>
        </span>
      </div>
    </div>
  `;
}

function renderGroupTemplate(context) {
  const groupClasses = [
    'sf-avatar-group',
    roundClass(context.roundSize).replace('sf-avatar-round', 'sf-avatar-group'),
    context.rootClass,
  ].filter(Boolean);

  return html`
    <div class=${groupClasses.join(' ')} style=${context.rootStyle || nothing}>
      ${context.avatars.map((avatar) => html`
        <div class=${['sf-avatar', 'sf-avatar-round', roundClass(context.roundSize)]
          .filter(Boolean)
          .join(' ')}>
          <button
            type="button"
            class="sf-avatar--image"
            style=${imageStyle(avatar.imageUrl || avatar.image_url)}
          ></button>
        </div>
      `)}
      ${context.avatarsMore
        ? html`
            <div class=${['sf-avatar-round', roundClass(context.roundSize)]
              .filter(Boolean)
              .join(' ')}>
              <button type="button" class="sf-avatar--image">
                <span>${context.avatarsMore}&gt;</span>
              </button>
            </div>
          `
        : nothing}
    </div>
  `;
}

function renderLabelTemplate(context) {
  const labelClasses = [
    'sf-avatar-label',
    context.labelSize ? `sf-avatar-label--${normalizeSize(context.labelSize)}` : '',
    context.rootClass,
  ].filter(Boolean);

  return html`
    <div class=${labelClasses.join(' ')} style=${context.rootStyle || nothing}>
      ${renderDefaultTemplate({
        ...context,
        imageUrl: context.avatarUrl,
        roundSize: context.avatarSize,
        active: false,
        check: false,
        rootClass: '',
        rootStyle: '',
      })}
      <div class="sf-avatar-label--text">
        <span>${context.labelText}</span>
        <span>${context.labelSecondText}</span>
      </div>
    </div>
  `;
}

function renderProfileTemplate(context) {
  const profileSize = context.profileSize;
  const checkSize = PROFILE_CHECK_SIZE_MAP[profileSize] || '4';
  const profileClasses = [
    'sf-avatar',
    'sf-avatar-profile',
    profileSize ? `sf-avatar-profile--${normalizeSize(profileSize)}` : '',
    context.rootClass,
  ].filter(Boolean);

  return html`
    <div class=${profileClasses.join(' ')} style=${context.rootStyle || nothing}>
      ${context.imageUrl ? html`<img src=${context.imageUrl} alt="" />` : nothing}
      <span class=${['sf-avatar-check', `sf-avatar-check--${checkSize}`].join(' ')}>
        ${checkIcon()}
      </span>
    </div>
  `;
}

export function renderAvatarsTemplate(context) {
  switch (context.templateName) {
    case 'user':
      return renderUserTemplate(context);
    case 'group':
      return renderGroupTemplate(context);
    case 'label':
      return renderLabelTemplate(context);
    case 'profile':
      return renderProfileTemplate(context);
    default:
      return renderDefaultTemplate(context);
  }
}
