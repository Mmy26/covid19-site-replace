<template>
  <div>
    <form @submit="onSubmit">
      <input
        type="file"
        @change="file"
        :state="Boolean(file)"
        accept=".csv"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
      />

      <button type="submit" variant="primary">Submit</button>
    </form>
  </div>
</template>

<script lang="js">



let file =  {};
let csvData = {};

const onSubmit = (evt)=> {
  console.log(this.file);
  evt.preventDefault();
  this.$papa.parse(this.file, {
    header: true,
    complete: function (results) {
      this.csvData = results.data;
      console.log(this.csvData);
    },
  });
}
</script>

<style lang="scss" scoped></style>
