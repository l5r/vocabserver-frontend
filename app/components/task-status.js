import Component from '@glimmer/component';
import { task, timeout } from 'ember-concurrency';
import { service } from '@ember/service';
import { modifier } from "ember-modifier";

export default class TaskStatusComponent extends Component {
  @service pushUpdates;

  monitorModel= modifier(async (element, [model]) => {
    await this.pushUpdates.monitorModel(model)
    return async () => {
      await this.pushUpdates.unMonitorModel(model)
    }
  })

  @task
  *monitorTaskProgress(task) {
    while (!task.hasEnded) {
      yield timeout(1000);
      yield task.reload();
    }
    if (this.args.onTaskFinished) {
      this.args.onTaskFinished(task);
    }
    return task;
  }
}
