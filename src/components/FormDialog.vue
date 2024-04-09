<template>
  <v-dialog
    :model-value="isOpenDialog"
    class="form-dialog"
    max-width="450"
    persistent
  >
    <v-card class="card">
      <v-card-title class="mb-2">
        <span class="headline">{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <!-- Children content -->
        <slot></slot>
      </v-card-text>
      <v-card-actions class="pt-3">
        <v-spacer></v-spacer>
        <v-btn color="grey" text class="body-2 font-weight-bold" @click="close"
          >Cancel</v-btn
        >
        <v-btn
          v-if="isEdit"
          color="#26CA99"
          class="body-2 font-weight-bold"
          outlined
          @click="onSubmit"
          >Save</v-btn
        >
        <v-btn
          v-else-if="isTransfer"
          color="#26CA99"
          class="body-2 font-weight-bold"
          outlined
          @click="onSubmit"
          >Transfer</v-btn
        >
        <v-btn
          v-else
          color="#26CA99"
          class="body-2 font-weight-bold"
          outlined
          @click="onSubmit"
          >Add</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "FormDialog",
  props: {
    isOpenDialog: Boolean,
    isEdit: Boolean,
    isTransfer: Boolean,
    title: {
      type: String,
      default: "Dialog Title",
    },
    onSubmit: {
      type: Function,
      required: true,
    },
    resetForm: {
      type: Function,
      required: true,
    },
  },
  methods: {
    close() {
      this.$emit("update:isOpenDialog", false);
      this.resetForm();
    },
  },
};
</script>

<style scoped>
.form-dialog .card {
  padding: 20px;
}
.headline {
  font-weight: 800;
}
</style>
