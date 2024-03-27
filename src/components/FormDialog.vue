<template>
  <v-dialog v-model="dialog" max-width="400" persistent>
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn size="small" color="#26CA99" v-bind="activatorProps">Add</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <!-- Children content -->
        <slot></slot>
      </v-card-text>
      <v-card-actions class="pt-3">
        <v-spacer></v-spacer>
        <v-btn
          color="grey"
          text
          class="body-2 font-weight-bold"
          @click="dialog = false"
          >Cancel</v-btn
        >
        <v-btn
          color="#26CA99"
          class="body-2 font-weight-bold"
          outlined
          @click="dialog = false"
          >Add</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "FormDialog",
  data() {
    return {
      dialog: false,
    };
  },
  props: {
    title: {
      type: String,
      default: "Dialog Title",
    },
    // onClose: {
    //   type: Function,
    //   required: true,
    // },
  },
};
</script>

<style scoped></style>
