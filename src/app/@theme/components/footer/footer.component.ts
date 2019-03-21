import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <small class="created-by">
      <i class="nb-angle-double-right"></i> Created by <strong>Pacas (potatofarms.9241)</strong>.&nbsp;
      Data and assets provided by <strong><a href="https://guildwars2.com" target="_blank">Guild Wars 2</a></strong>
    </small>
    <div class="socials">
      <a href="https://github.com/potatofarms" target="_blank" class="ion ion-social-github"></a>
    </div>
  `,
})
export class FooterComponent {
}
