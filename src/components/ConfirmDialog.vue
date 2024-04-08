<template>
  <v-dialog
    :model-value="isOpenConfirmDialog"
    max-width="500"
    class="confirm-dialog"
    persistent
  >
    <v-card class="card">
      <v-card-title>
        <span class="headline">Delete {{ title }}</span>
      </v-card-title>
      <v-card-text class="pb-5">
        Are you sure you want to delete this {{ title.toLowerCase() }}? <br />
        You can&apos;t undo this action afterwards.
        <br />
        <strong>
          {{ msg }}
        </strong>
      </v-card-text>
      <v-card-actions class="pt-3">
        <v-spacer></v-spacer>
        <v-btn color="grey" text class="body-2 font-weight-bold" @click="close"
          >Cancel</v-btn
        >
        <v-btn
          color="#26CA99"
          class="body-2 font-weight-bold"
          outlined
          @click="onDelete(item)"
          >Delete</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ConfirmDialog",
  props: {
    title: String,
    isOpenConfirmDialog: Boolean,
    onDelete: {
      type: Function,
      required: true,
    },
    msg: {
      type: String,
      required: false,
    },
  },
  methods: {
    close() {
      this.$emit("update:isOpenConfirmDialog", false);
    },
  },
};
</script>

<style scoped>
.confirm-dialog .card {
  padding: 20px;
}
.headline {
  font-weight: 800;
}
</style>
