/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = Em.Route.extend({
  route: '/services/add',

  enter: function (router) {
    console.log('in /service/add:enter');

    Ember.run.next(function () {
      var addServiceController = router.get('addServiceController');
      router.transitionTo('step' + addServiceController.get('currentStep'));
    });

  },

  connectOutlets: function (router) {
    console.log('in /service/add:connectOutlets');
    router.get('mainController').connectOutlet('addService');
  },

  step1: Em.Route.extend({
    route: '/step1',
    connectOutlets: function (router) {
      console.log('in addService.step1:connectOutlets');
      var controller = router.get('addServiceController');
      controller.setCurrentStep('1', false);
      controller.set('hideBackButton', true);
      controller.loadAllPriorSteps();
      controller.connectOutlet('wizardStep4', controller.get('content.services'));
    },
    next: function (router) {
      var addServiceController = router.get('addServiceController');
      var wizardStep4Controller = router.get('wizardStep4Controller');
      addServiceController.saveServices(wizardStep4Controller);
      addServiceController.saveClients(wizardStep4Controller);
      App.db.setMasterComponentHosts(undefined);
      router.transitionTo('step2');
    }
  }),

  step2: Em.Route.extend({
    route: '/step2',
    connectOutlets: function (router) {
      console.log('in addService.step2:connectOutlets');
      var controller = router.get('addServiceController');
      controller.setCurrentStep('2', false);
      controller.loadAllPriorSteps();
      controller.set('hideBackButton', false);
      controller.connectOutlet('wizardStep5', controller.get('content'));

    },
    back: Em.Router.transitionTo('step1'),
    next: function (router) {
      var addServiceController = router.get('addServiceController');
      var wizardStep5Controller = router.get('wizardStep5Controller');
      addServiceController.saveMasterComponentHosts(wizardStep5Controller);
      App.db.setSlaveComponentHosts(undefined);
      App.db.setHostSlaveComponents(undefined);
      router.transitionTo('step3');
    }
  }),

  step3: Em.Route.extend({
    route: '/step3',
    connectOutlets: function (router) {
      console.log('in addService.step3:connectOutlets');
      var controller = router.get('addServiceController');
      controller.setCurrentStep('3', false);
      controller.loadAllPriorSteps();
      controller.connectOutlet('wizardStep6', controller.get('content'));
    },
    back: Em.Router.transitionTo('step2'),
    next: function (router) {
      var addServiceController = router.get('addServiceController');
      var wizardStep6Controller = router.get('wizardStep6Controller');

      if (wizardStep6Controller.validate()) {
        addServiceController.saveSlaveComponentHosts(wizardStep6Controller);
        addServiceController.get('content').set('serviceConfigProperties', null);
        App.db.setServiceConfigProperties(null);
        router.transitionTo('step4');
      }
    }
  }),

  step4: Em.Route.extend({
    route: '/step4',
    connectOutlets: function (router) {
      console.log('in addService.step4:connectOutlets');
      var controller = router.get('addServiceController');
      controller.setCurrentStep('4', false);
      controller.loadAllPriorSteps();
      controller.connectOutlet('wizardStep7', controller.get('content'));
    },
    back: Em.Router.transitionTo('step3'),
    next: function (router) {
      var addServiceController = router.get('addServiceController');
      var wizardStep7Controller = router.get('wizardStep7Controller');
      addServiceController.saveServiceConfigProperties(wizardStep7Controller);
      router.transitionTo('step5');
    }
  }),

  step5: Em.Route.extend({
    route: '/step5',
    connectOutlets: function (router, context) {
      console.log('in addService.step5:connectOutlets');
      var controller = router.get('addServiceController');
      controller.setCurrentStep('5', false);
      controller.loadAllPriorSteps();
      controller.connectOutlet('wizardStep8', controller.get('content'));
    },
    back: Em.Router.transitionTo('step4'),
    next: function (router) {
      var addServiceController = router.get('addServiceController');
      var wizardStep8Controller = router.get('wizardStep8Controller');
      addServiceController.installServices();
      addServiceController.setInfoForStep9();
      router.transitionTo('step6');
    }
  }),

  step6: Em.Route.extend({
    route: '/step6',
    connectOutlets: function (router, context) {
      console.log('in addService.step6:connectOutlets');
      var controller = router.get('addServiceController');
      controller.setCurrentStep('6', false);
      controller.loadAllPriorSteps();
      controller.connectOutlet('wizardStep9', controller.get('content'));
    },
    back: Em.Router.transitionTo('step5'),
    retry: function(router,context) {
      var addServiceController = router.get('addSrviceController');
      var wizardStep9Controller = router.get('wizardStep9Controller');
      if (!wizardStep9Controller.get('isSubmitDisabled')) {
        addServiceController.installServices();
        addServiceController.setInfoForStep9();
        wizardStep9Controller.navigateStep();
      }
    },
    next: function (router) {
      var addServiceController = router.get('addServiceController');
      var wizardStep9Controller = router.get('wizardStep9Controller');
      //addServiceController.saveClusterInfo(wizardStep9Controller);
      addServiceController.saveInstalledHosts(wizardStep9Controller);
      router.transitionTo('step7');
    }
  }),

  step7: Em.Route.extend({
    route: '/step7',
    connectOutlets: function (router, context) {
      console.log('in addService.step7:connectOutlets');
      var controller = router.get('addServiceController');
      controller.setCurrentStep('7', false);
      controller.loadAllPriorSteps();
      controller.connectOutlet('wizardStep10', controller.get('content'));
    },
    back: Em.Router.transitionTo('step6'),
    complete: function (router, context) {
      if (true) {   // this function will be moved to installerController where it will validate
        var addServiceController = router.get('addServiceController');
        addServiceController.setCurrentStep('1', false);
        router.transitionTo('services');
      }
    }
  }),

  gotoStep1: Em.Router.transitionTo('step1'),

  gotoStep2: Em.Router.transitionTo('step2'),

  gotoStep3: Em.Router.transitionTo('step3'),

  gotoStep4: Em.Router.transitionTo('step4'),

  gotoStep5: Em.Router.transitionTo('step5'),

  gotoStep6: Em.Router.transitionTo('step6'),

  gotoStep7: Em.Router.transitionTo('step7'),

  backToServices: function (router) {
    router.transitionTo('services');
  }

});
