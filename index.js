class Form {
  constructor({ initialValues = {}, fields, onSubmit }) {
    this.values = { ...initialValues };
    this.onSubmit = onSubmit;
    this.disabled = true;
    this.onChangeHandler = null;
    this.validateHandler = null;
    this.errors = null;

    fields.forEach((field) => {
      if (field.type === "input") {
        this._bindInputByName(field.name);
      }

      if (field.type === "checkbox") {
        this._bindCheckboxByName(field.name);
      }
    });
  }

  onChange(func) {
    this.onChangeHandler = func;
  }

  validate(func) {
    this.validateHandler = func;
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
    this._setErrors();
  }

  _setErrors() {
    function insertAfter(referenceNode, newNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    const errorsFieldName = Object.keys(this.errors);

    errorsFieldName.forEach((name) => {
      // insertAfter()
      // const selector = `input[name=${name}]`;
      // const el = document.querySelector(selector);
      // const error = document.createTextNode("required");
      // insertAfter(el, error);
    });
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

    return errors;
  };

  const myForm = new Form({ initialValues, fields, onSubmit });

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

  myForm.validate(validateHandler);
});
