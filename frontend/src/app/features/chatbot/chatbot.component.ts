import { Component, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ApiService } from '../../core/services/api.service';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  html?: SafeHtml;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule],
  template: `
    <!-- Floating Button - higher on mobile to avoid bottom nav -->
    @if (!open) {
      <button (click)="open = true"
        class="fixed bottom-24 md:bottom-6 right-4 md:right-6 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl shadow-xl shadow-emerald-600/30 hover:shadow-2xl hover:shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border-none z-40 flex items-center justify-center">
        <span class="material-symbols-outlined" style="font-size:26px">chat</span>
      </button>
    }

    <!-- Chat Panel - full screen on mobile, floating on desktop -->
    @if (open) {
      <div class="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-[400px] md:h-[560px] bg-white md:rounded-2xl shadow-2xl shadow-slate-900/10 md:border md:border-slate-200/80 flex flex-col overflow-hidden z-50">
        <!-- Header -->
        <div class="flex items-center justify-between px-4 md:px-5 py-3.5 md:py-4 border-b border-emerald-100/50 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 safe-top-chat">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center">
              <span class="material-symbols-outlined filled text-white" style="font-size:20px">smart_toy</span>
            </div>
            <div>
              <p class="text-[14px] font-bold text-white tracking-tight">Farm AI Assistant</p>
              <p class="text-[11px] text-white/60 font-medium">Powered by Gemini</p>
            </div>
          </div>
          <button (click)="open = false" class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition cursor-pointer bg-transparent border-none text-white/80 hover:text-white">
            <span class="material-symbols-outlined" style="font-size:22px">close</span>
          </button>
        </div>

        <!-- Messages -->
        <div #messagesContainer class="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          @if (messages.length === 0) {
            <div class="text-center py-6 md:py-8">
              <div class="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
                <span class="material-symbols-outlined filled text-emerald-500" style="font-size:28px">eco</span>
              </div>
              <p class="text-[14px] font-semibold text-slate-700 mb-1">Ask me anything about farming!</p>
              <p class="text-[12px] text-slate-400">Crop advice, pest control, weather tips...</p>
              <div class="flex flex-wrap justify-center gap-2 mt-4 px-2">
                @for (q of quickQuestions; track q) {
                  <button (click)="sendQuick(q)"
                    class="text-[12px] font-medium px-3.5 py-2 bg-white border border-slate-200 rounded-full text-slate-600 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer shadow-sm active:scale-95">
                    {{ q }}
                  </button>
                }
              </div>
            </div>
          }

          @for (msg of messages; track $index) {
            <div [class]="'flex ' + (msg.role === 'user' ? 'justify-end' : 'justify-start')">
              @if (msg.role === 'user') {
                <div class="max-w-[80%] px-4 py-2.5 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl rounded-br-md text-[13px] md:text-[13px] leading-relaxed shadow-sm">
                  {{ msg.content }}
                </div>
              } @else {
                <div class="max-w-[88%] md:max-w-[85%] px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-bl-md text-[13px] leading-relaxed shadow-sm chat-markdown" [innerHTML]="msg.html"></div>
              }
            </div>
          }

          @if (thinking) {
            <div class="flex justify-start">
              <div class="px-4 py-3 bg-white border border-slate-200 rounded-2xl rounded-bl-md shadow-sm">
                <div class="flex gap-1.5">
                  <span class="w-2 h-2 bg-emerald-300 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                  <span class="w-2 h-2 bg-emerald-300 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                  <span class="w-2 h-2 bg-emerald-300 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Input -->
        <div class="p-3 border-t border-slate-100 bg-white safe-bottom-chat">
          <form (ngSubmit)="send()" class="flex gap-2">
            <input type="text" [(ngModel)]="input" name="msg" [disabled]="thinking"
              class="flex-1 px-4 py-3 md:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[16px] md:text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition placeholder-slate-400"
              placeholder="Type a message...">
            <button type="submit" [disabled]="!input.trim() || thinking"
              class="w-12 h-12 md:w-10 md:h-10 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-xl flex items-center justify-center hover:from-emerald-500 hover:to-teal-500 transition disabled:opacity-40 cursor-pointer border-none shrink-0 shadow-sm active:scale-95">
              <span class="material-symbols-outlined" style="font-size:20px">send</span>
            </button>
          </form>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: contents; }
    .safe-top-chat { padding-top: env(safe-area-inset-top); }
    .safe-bottom-chat { padding-bottom: env(safe-area-inset-bottom); }

    /* Markdown rendering styles for assistant messages */
    :host ::ng-deep .chat-markdown {
      line-height: 1.6;
      word-wrap: break-word;

      p {
        margin: 0 0 8px 0;
        &:last-child { margin-bottom: 0; }
      }

      strong, b {
        font-weight: 700;
        color: #1e293b;
      }

      em, i { font-style: italic; }

      h3 {
        font-size: 13px;
        font-weight: 700;
        color: #0f172a;
        margin: 12px 0 6px 0;
        padding-bottom: 4px;
        border-bottom: 1px solid #e2e8f0;
        &:first-child { margin-top: 0; }
      }

      ul, ol {
        margin: 6px 0 10px 0;
        padding-left: 0;
        list-style: none;
      }

      li {
        position: relative;
        padding-left: 16px;
        margin-bottom: 5px;
        font-size: 13px;
        line-height: 1.5;

        &::before {
          content: '';
          position: absolute;
          left: 2px;
          top: 7px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #10b981;
        }
      }

      ol li {
        counter-increment: item;
        &::before {
          content: counter(item) '.';
          position: absolute;
          left: 0; top: 0;
          width: auto; height: auto;
          border-radius: 0;
          background: transparent;
          color: #10b981;
          font-weight: 700;
          font-size: 12px;
        }
      }
      ol { counter-reset: item; }

      code {
        background: #f1f5f9;
        padding: 1px 5px;
        border-radius: 4px;
        font-size: 12px;
        font-family: 'SF Mono', 'Consolas', monospace;
        color: #059669;
      }

      br + br { display: none; }
    }
  `],
})
export class ChatbotComponent {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  open = false;
  input = '';
  thinking = false;
  messages: Message[] = [];

  quickQuestions = [
    'Best crops for summer?',
    'How to control pests?',
    'Irrigation tips',
    'Soil health guide',
  ];

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  private formatMarkdown(text: string): SafeHtml {
    let html = text;
    html = html.replace(/\r\n/g, '\n');
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Code blocks
    html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_m, _lang, code) => {
      return `<code style="display:block; white-space:pre-wrap; margin:8px 0; padding:8px; background:#f1f5f9; border-radius:8px; font-size:12px;">${code.trim()}</code>`;
    });
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold & italic
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    html = html.replace(/(?<!\w)\*([^*]+?)\*(?!\w)/g, '<em>$1</em>');
    html = html.replace(/(?<!\w)_([^_]+?)_(?!\w)/g, '<em>$1</em>');

    const lines = html.split('\n');
    const result: string[] = [];
    let inList = false;
    let listType = 'ul';

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      if (/^#{1,3}\s+(.+)$/.test(line)) {
        if (inList) { result.push(`</${listType}>`); inList = false; }
        const content = line.replace(/^#{1,3}\s+/, '');
        result.push(`<h3>${content}</h3>`);
        continue;
      }

      const ulMatch = line.match(/^[-*•]\s+(.+)$/);
      if (ulMatch) {
        if (!inList || listType !== 'ul') {
          if (inList) result.push(`</${listType}>`);
          result.push('<ul>'); inList = true; listType = 'ul';
        }
        result.push(`<li>${ulMatch[1]}</li>`);
        continue;
      }

      const olMatch = line.match(/^\d+[.)]\s+(.+)$/);
      if (olMatch) {
        if (!inList || listType !== 'ol') {
          if (inList) result.push(`</${listType}>`);
          result.push('<ol>'); inList = true; listType = 'ol';
        }
        result.push(`<li>${olMatch[1]}</li>`);
        continue;
      }

      if (inList) { result.push(`</${listType}>`); inList = false; }

      if (line === '') { result.push('<br>'); continue; }
      result.push(`<p>${line}</p>`);
    }

    if (inList) result.push(`</${listType}>`);

    let finalHtml = result.join('');
    finalHtml = finalHtml.replace(/(<br>\s*){3,}/g, '<br><br>');
    finalHtml = finalHtml.replace(/<p><\/p>/g, '');

    return this.sanitizer.bypassSecurityTrustHtml(finalHtml);
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.messagesContainer) {
        const el = this.messagesContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    }, 50);
  }

  sendQuick(q: string) {
    this.input = q;
    this.send();
  }

  send() {
    const text = this.input.trim();
    if (!text) return;
    this.messages.push({ role: 'user', content: text });
    this.input = '';
    this.thinking = true;
    this.cdr.detectChanges();
    this.scrollToBottom();

    const history = this.messages.slice(0, -1).map(m => ({
      role: m.role,
      content: m.content,
    }));

    this.api.sendMessage(text, history).subscribe({
      next: (res) => {
        const content = res.response || res.message || 'Sorry, I couldn\'t process that.';
        this.messages.push({ role: 'assistant', content, html: this.formatMarkdown(content) });
        this.thinking = false;
        this.cdr.detectChanges();
        this.scrollToBottom();
      },
      error: () => {
        const content = 'Sorry, something went wrong. Please try again.';
        this.messages.push({ role: 'assistant', content, html: this.formatMarkdown(content) });
        this.thinking = false;
        this.cdr.detectChanges();
        this.scrollToBottom();
      },
    });
  }
}
