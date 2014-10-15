import Ember from "ember";

export default Ember.ObjectController.extend({
  createdAgo: function() {
    return moment(this.get('createdAt')).fromNow();
  }.property('createdAt'),

  updatedAgo: function() {
    return moment(this.get('updatedAt')).fromNow();
  }.property('updatedAt'),

  actions: {
    saveCampaign: function() {
      var campaign = this.get('content');

      if (!campaign.get('canBeSaved')) {
        sweetAlert("Error", "The campaign don't have all required properties", "error");
        return;
      }

      campaign.save().then(function() {
        swal("Success", "Campaing created", "success")
      }).catch(function() {
        sweetAlert("Error", "Error while creating the campaign", "error");
      });
    },

    deleteCampaign: function() {
      swal({
        title: "Are you sure?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: false
      }, function() {
        this.get('content').destroyRecord();
      }.bind(this));
    }
  }
});