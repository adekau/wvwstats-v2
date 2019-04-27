import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { throwIfAlreadyLoaded } from './module-import-guard';
import {
  AnalyticsService,
  LayoutService,
  StateService,
} from './utils';

import { ServicesModule } from './services/services.module';
import { WorldService } from './services/world.service';
import { ObjectiveService } from './services/objective.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TimeoutInterceptor, DEFAULT_TIMEOUT } from './interceptors/timeout.interceptor';

const DATA_SERVICES = [
  // example { provide: UserData, useClass: UserService },
];

export const NB_CORE_PROVIDERS = [
  ...ServicesModule.forRoot().providers,
  ...DATA_SERVICES,
  AnalyticsService,
  LayoutService,
  StateService,
  WorldService,
  ObjectiveService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
        [{ provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true }],
        [{ provide: DEFAULT_TIMEOUT, useValue: 10000 }],
      ],
    };
  }
}
