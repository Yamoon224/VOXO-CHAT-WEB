/** Styles injectés dans la racine Shadow DOM (isolation du site hôte, section 2.3). */
export function buildStyles(primaryColor: string): string {
  return `
    :host { all: initial; }
    * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .bubble {
      position: fixed; bottom: 20px; width: 56px; height: 56px; border-radius: 50%;
      background: ${primaryColor}; color: #fff; border: none; cursor: pointer;
      box-shadow: 0 4px 14px rgba(0,0,0,.2); font-size: 24px; z-index: 2147483000;
      display: flex; align-items: center; justify-content: center;
    }
    .bubble.left { left: 20px; }
    .bubble.right { right: 20px; }
    .bubble .dot {
      position: absolute; top: -2px; right: -2px; width: 12px; height: 12px;
      border-radius: 50%; background: #ef4444; border: 2px solid #fff;
    }
    .panel {
      position: fixed; bottom: 88px; width: 360px; max-width: calc(100vw - 32px);
      height: 520px; max-height: calc(100vh - 140px); background: #fff; border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0,0,0,.25); display: flex; flex-direction: column;
      overflow: hidden; z-index: 2147483000;
    }
    .panel.left { left: 20px; }
    .panel.right { right: 20px; }
    .header { background: ${primaryColor}; color: #fff; padding: 14px 16px; font-size: 14px; font-weight: 600; }
    .header .presence { font-size: 11px; font-weight: 400; opacity: .85; margin-top: 2px; }
    .banner { background: #fef3c7; color: #92400e; font-size: 12px; padding: 8px 12px; }
    .messages { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
    .welcome { font-size: 13px; color: #374151; background: #f3f4f6; border-radius: 8px; padding: 10px 12px; }
    .msg { max-width: 85%; padding: 8px 12px; border-radius: 10px; font-size: 13px; line-height: 1.4; white-space: pre-wrap; }
    .msg.visitor { align-self: flex-end; background: ${primaryColor}; color: #fff; }
    .msg.other { align-self: flex-start; background: #f3f4f6; color: #111827; }
    .typing { font-size: 12px; color: #6b7280; font-style: italic; padding: 0 12px; }
    .composer { display: flex; gap: 8px; padding: 10px; border-top: 1px solid #e5e7eb; }
    .composer textarea {
      flex: 1; resize: none; border: 1px solid #d1d5db; border-radius: 8px; padding: 8px 10px;
      font-size: 13px; max-height: 80px;
    }
    .composer button {
      background: ${primaryColor}; color: #fff; border: none; border-radius: 8px;
      padding: 0 14px; font-size: 13px; cursor: pointer;
    }
    .composer button:disabled { opacity: .5; cursor: default; }
    .footer { text-align: center; font-size: 11px; color: #9ca3af; padding: 6px 0; }
    .rating { display: flex; gap: 4px; justify-content: center; padding: 8px 0; }
    .rating button { background: none; border: none; font-size: 20px; cursor: pointer; color: #d1d5db; }
    .rating button.active { color: #f59e0b; }
    .close { background: none; border: none; color: #fff; font-size: 18px; cursor: pointer; float: right; line-height: 1; }
  `;
}
