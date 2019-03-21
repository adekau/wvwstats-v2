import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">Created by <strong>Pacas (potatofarms.9241)</strong>. Data and assets provided by <strong><a href="https://guildwars2.com" target="_blank">Guild Wars 2</a></strong></span>
    <div class="socials">
      <a href="https://github.com/potatofarms" target="_blank" class="ion ion-social-github"></a>
    </div>
  `,
})
export class FooterComponent {
}
