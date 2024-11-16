import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nPipe } from './i18n.pipe';
import { JsonPipe } from './json.pipe';
import { TimePipe } from './time.pipe';
import { CovertTranslationPipe } from './covert-translation.pipe';
import { HighlightPipe } from './highlight.pipe';
import { DateTimePipe } from './datetime.pipe';
import { IframeUrlPipe } from './iframeUrl';
import { FilterPipe } from './filter.pipe';

@NgModule({
  declarations: [
    I18nPipe,
    JsonPipe,
    TimePipe,
    CovertTranslationPipe,
    HighlightPipe,
    DateTimePipe,
    IframeUrlPipe,
    FilterPipe,
  ],
  imports: [CommonModule],
  exports: [
    I18nPipe,
    JsonPipe,
    TimePipe,
    CovertTranslationPipe,
    HighlightPipe,
    DateTimePipe,
    IframeUrlPipe,
    FilterPipe,
  ],
})
export class PipesModule {}
