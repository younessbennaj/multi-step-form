const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

class Form {
  constructor({ initialValues = {}, fields, onSubmit, validate }) {
    this.values = { ...initialValues };
    this.onSubmit = onSubmit;
    this.disabled = true;
    this.onChangeHandler = null;
    this.validateHandler = validate;
    this.errors = null;
    this.visited = {};
    this.hasError = {};
    this.fields = fields;

    this.init();
  }

  init() {
    this.setFields();
    this._handleErrors();
  }

  setFields() {
    this.fields.forEach((field) => {
      if (field.type === "input") {
        this._bindInputByName(field.name);
      }

      if (field.type === "checkbox") {
        this._bindCheckboxByName(field.name);
      }

      this.visited[field.name] = false;
      this.hasError[field.name] = false;
    });
  }

  onChange(func) {
    this.onChangeHandler = func;
  }

  handleSubmit() {
    this.onSubmit(this.values);
  }

  _toggleDisabled() {
    this.disabled = !Boolean(this.disabled);
  }

  _handleValuesChange() {
    this.onChangeHandler && this.onChangeHandler();
    this._handleErrors();
  }

  _setFieldError(fieldName, error) {
    const selector = `input[name=${fieldName}]`;
    const el = document.querySelector(selector);

    const errorElement = document.getElementById(`${fieldName}-error`);

    if (errorElement) {
      errorElement.innerText = error;
    } else {
      el.insertAdjacentHTML(
        "afterend",
        `<div id="${fieldName}-error">${error}</div>`
      );
    }

    this.hasError[fieldName] = true;
  }

  _deleteFieldError(fieldName) {
    const selector = `input[name=${fieldName}]`;
    const el = document.querySelector(selector);

    if (el && el.nextSibling) {
      el.parentNode.removeChild(el.nextSibling);
      this.hasError[fieldName] = false;
    }
  }

  _handleErrors() {
    if (this.validateHandler) {
      const errors = this.validateHandler(this.values);
      this.errors = errors;
    }
  }

  _bindInputByName(fieldName) {
    const selector = `input[name=${fieldName}]`;
    const input = document.querySelector(selector);

    input.addEventListener("input", (event) => {
      this.values[fieldName] = event.currentTarget.value;
      this._handleValuesChange();
    });

    input.addEventListener("blur", (event) => {
      this.visited[fieldName] = true;

      console.log(this.errors);

      if (this.errors[fieldName]) {
        this._setFieldError(fieldName, this.errors[fieldName]);
      }

      if (this.hasError[fieldName] && !this.errors[fieldName]) {
        this._deleteFieldError(fieldName);
      }
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

        // UTILS
        this._handleValuesChange();
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
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

  const validateHandler = (values) => {
    const errors = {};

    // if name is missing
    if (!values.name) {
      errors.name = "required";
    }

    // if name is missing
    if (!values.email) {
      errors.email = "required";
    }

    if (values.email && !validateEmail(values.email)) {
      errors.email = "wrong email format";
    }

    return errors;
  };

  const myForm = new Form({
    initialValues,
    fields,
    onSubmit,
    validate: validateHandler,
  });

  const submitButton = document.getElementById("submit");

  submitButton.setAttribute("disabled", "true");

  submitButton.addEventListener("click", () => {
    myForm.handleSubmit();
  });

  myForm.onChange(function () {
    if (this.disabled) {
      submitButton.setAttribute("disabled", "true");
    } else {
      submitButton.removeAttribute("disabled");
    }
  });
});
