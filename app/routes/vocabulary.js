import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import monitorModelURI from 'ember-polling-push-updates/decorators/monitor-model-uri'

@monitorModelURI
export default class VocabulariesShowRoute extends Route {
  @service store;
  @service pushUpdates;
  @service router;

  async model(params) {
    return await this.store.findRecord('vocabulary', params.id, { reload: true });
  }

  async setupController(_controller, model) {
    super.setupController(...arguments)
    await this.setupHadler(model)
  }

  async setupHadler(model) {
    await this.pushUpdates.monitorResource({
      uri: model.uri,
      callback: () => { this.router.refresh() }
    });
  }
}
