document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  // const button = document.getElementById("submit");
  const formValues = {};

  function bindInputById(id) {
    // get by input name instead of id
    const input = document.getElementById(id);

    input.addEventListener("input", (event) => {
      formValues[id] = event.currentTarget.value;
    });
  }

  bindInputById("name");
  bindInputById("email");

  formValues.interests = [];

  const checkboxes = document.querySelectorAll(
    "input[type=checkbox][name=interest]"
  );

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const { value } = event.currentTarget;
      const newSet = new Set(formValues.interests);
      newSet.has(value) ? newSet.delete(value) : newSet.add(value);
      formValues.interests = Array.from(newSet);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log(event);
    console.log("formValues", formValues);
  });
});
