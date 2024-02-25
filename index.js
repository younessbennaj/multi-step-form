const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

class Form {
  constructor({ initialValues = {}, fields, onSubmit, validate, onInit }) {
    this.values = { ...initialValues };
    this.onSubmit = onSubmit;
    this.hasValidationError = true;
    this.onChangeHandler = null;
    this.validateHandler = validate;
    this.errors = null;
    this.visited = {};
    this.hasError = {};
    this.fields = fields;
    this.onInit = onInit;

    this.#_init();
  }

  #_init() {
    this.#_setFields();
    this.#_handleErrors();
    this.#_setHasValidationError();
    this.onInit();
  }

  #_setFields() {
    this.fields.forEach((field) => {
      if (field.type === "input") {
        this.#_bindInputByName(field.name);
      }

      if (field.type === "checkbox") {
        this.#_bindCheckboxByName(field.name);
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

  #_handleBlur(fieldName) {
    this.#_handleValuesChange();
    this.visited[fieldName] = true;
    this.#_handleFieldError(fieldName);
  }

  #_handleFieldError(fieldName) {
    if (this.errors[fieldName]) {
      this.#_setFieldError(fieldName, this.errors[fieldName]);
    }

    if (this.hasError[fieldName] && !this.errors[fieldName]) {
      this.#_deleteFieldError(fieldName);
    }
  }

  #_handleValuesChange(fieldName) {
    this.#_handleErrors();
    this.#_setHasValidationError();
    this.visited[fieldName] && this.#_handleFieldError(fieldName);
    this.onChangeHandler && this.onChangeHandler();
  }

  #_setFieldError(fieldName, error) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    errorElement.innerText = error;
    errorElement.classList.add("visible");
    this.hasError[fieldName] = true;
  }

  #_deleteFieldError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    errorElement.innerText = null;
    errorElement.classList.remove("visible");
    this.hasError[fieldName] = false;
  }
  // replace with private syntax
  #_handleErrors() {
    if (this.validateHandler) {
      const errors = this.validateHandler(this.values);
      this.errors = errors;
    }
  }

  #_setHasValidationError() {
    this.hasValidationError = Boolean(Object.keys(this.errors).length);
  }

  #_bindInputByName(fieldName) {
    const selector = `input[name=${fieldName}]`;
    const input = document.querySelector(selector);

    input.addEventListener("input", (event) => {
      this.values[fieldName] = event.currentTarget.value;
      this.#_handleValuesChange(fieldName);
    });

    input.addEventListener("blur", () => {
      this.#_handleBlur(fieldName);
    });
  }

  #_bindCheckboxByName(fieldName) {
    const selector = `input[type=checkbox][name=${fieldName}]`;
    const checkboxes = document.querySelectorAll(selector);

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        const { value } = event.currentTarget;
        const newSet = new Set(this.values[fieldName]);
        newSet.has(value) ? newSet.delete(value) : newSet.add(value);
        this.values[fieldName] = Array.from(newSet);
        this.#_handleValuesChange(fieldName);
      });
    });

    checkboxes.forEach((checkbox) => {
      const labelSelector = "label[for='" + checkbox.attributes.id.value + "']";
      const label = document.querySelector(labelSelector);

      label.addEventListener("mouseup", (event) => {
        this.#_handleBlur(fieldName);
      });
    });
  }
}

const submitButton = document.getElementById("submit");

const initialValues = {
  email: "",
  interests: [],
  name: "",
};

// merge with initialValues
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

const validate = (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = "required";
  }

  if (!values.email) {
    errors.email = "required";
  }

  if (values.email && !validateEmail(values.email)) {
    errors.email = "wrong email format";
  }

  if (!values.interests || values.interests.length === 0) {
    errors.interests = "select at least 1 element";
  }

  return errors;
};

function onInit() {
  // if (this.hasValidationError) {
  //   submitButton.setAttribute("disabled", "true");
  // }
}

const myForm = new Form({
  initialValues,
  fields,
  onSubmit,
  validate,
  onInit,
});

myForm.onChange(function () {
  // if (this.hasValidationError) {
  //   submitButton.setAttribute("disabled", "true");
  // } else {
  //   submitButton.removeAttribute("disabled");
  // }
});

let currentIndex = 0;

const steps = ["personal-information", "topics", "resume"];

function displayCurrentStep() {
  steps.forEach((selector, index) => {
    const displayProperty = currentIndex === index ? "block" : "none";
    document.getElementById(selector).style.display = displayProperty;
  });
}

displayCurrentStep();

submitButton.addEventListener("click", () => {
  if (currentIndex < steps.length - 1) {
    currentIndex++;
    displayCurrentStep();
  } else {
    myForm.handleSubmit();
  }
});
