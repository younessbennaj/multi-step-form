class Form {
  constructor({ initialValues = {}, fields, form, onSubmit }) {
    this.values = { ...initialValues };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      onSubmit(this.values);
    });

    fields.forEach((field) => {
      if (field.type === "input") {
        this._bindInputByName(field.name);
      }

      if (field.type === "checkbox") {
        this._bindCheckboxByName(field.name);
      }
    });
  }

  _bindInputByName(fieldName) {
    const selector = `input[name=${fieldName}]`;
    const input = document.querySelector(selector);

    input.addEventListener("input", (event) => {
      this.values[fieldName] = event.currentTarget.value;
    });
  }

  _bindCheckboxByName(fieldName) {
    const selector = `input[type=checkbox][name=${fieldName}]`;
    const checkboxes = document.querySelectorAll(selector);

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        const { value } = event.currentTarget;
        const newSet = new Set(this.values[fieldName]);
        newSet.has(value) ? newSet.delete(value) : newSet.add(value);
        this.values[fieldName] = Array.from(newSet);
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");

  const initialValues = {
    email: "",
    interests: [],
    name: "",
  };

  const fields = [
    {
      type: "input",
      name: "name",
    },
    {
      type: "input",
      name: "email",
    },
    {
      type: "checkbox",
      name: "interests",
    },
  ];

  const onSubmit = (values) => {
    console.log("values", values);
  };

  const myForm = new Form({ initialValues, fields, form, onSubmit });
});
