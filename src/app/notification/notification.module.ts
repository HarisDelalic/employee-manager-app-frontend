import { NgModule } from "@angular/core";
import { NotifierModule } from 'angular-notifier';
import { notifierDefaultOptions } from './default-options';

@NgModule({
    imports: [NotifierModule.withConfig(notifierDefaultOptions)],
    exports: [NotifierModule]
})
export class NotificationModule {}