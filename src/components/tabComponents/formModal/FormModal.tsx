import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Button,
  Input,
  Label,
  Dropdown,
  Option,
  Field,
} from "@fluentui/react-components";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import { useEffect, useState } from "react";
import Logo from "../../assets/images/digivaletLogo.svg";
import "./FormModal.css";
import { TimePicker } from "@fluentui/react-timepicker-compat";
import {
  useAddOfficeVisit,
  useCustomFields,
  usePropertyLocations,
  useVisitorTypes,
} from "../../graphql/hooks/hooks";
import { VisitorLocationType, VisitorType } from "../../types";
import { useForm } from "react-hook-form";

export const FormModal = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [visitType, setVisitType] = useState("");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const { loadingVisitorTypesData, visitorTypesData } = useVisitorTypes();
  const { customFieldsData } = useCustomFields(visitType);
  const {
    addOfficeVisitorFunction,
    addVisitorDataError,
    loadingaddVisitorData,
  } = useAddOfficeVisit();
  const { loadingVisitorLocationsData, visitorLocationsData } =
    usePropertyLocations();

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm({ mode: "onTouched", reValidateMode: "onChange" });

  const titleOptions = ["Mr", "Mrs", "Ms", "Miss"];

  function onsubmit(data: any) {
    // console.log(data);
    setIsSubmittingForm(true);
    addOfficeVisitorFunction(data, customFieldsData);
    // console.log(addVisitorDataError);
  }

  useEffect(() => {
    if (isSubmittingForm) {
      if (addVisitorDataError) {
        console.error("Error from backend:", addVisitorDataError);
        alert("Error from backend");
        setIsSubmittingForm(false);
      } else if (!loadingaddVisitorData) {
        reset();
        setIsDialogOpen(false);
        setIsSubmittingForm(false);
      }
    }
  }, [addVisitorDataError, loadingaddVisitorData]);

  return (
    <Dialog
      modalType="non-modal"
      open={isDialogOpen}
      onOpenChange={(_, { open }) => {
        setIsDialogOpen(open), reset();
      }}
    >
      <DialogTrigger disableButtonEnhancement>
        <Button appearance="primary" onClick={() => setIsDialogOpen(true)}>
          Create Visit
        </Button>
      </DialogTrigger>
      <DialogSurface
        aria-describedby={undefined}
        backdrop={<div aria-hidden="true"></div>}
        style={{
          maxWidth: "600px",
          padding: "32px 32px 32px 32px",
          borderRadius: "4px",
        }}
      >
        <form onSubmit={handleSubmit(onsubmit)}>
          <DialogBody>
            <DialogTitle>
              <div className="form-title-box">
                <img src={Logo} width={40} height={40} alt="" />
                <div className="form-tilte-text">
                  <h4>Digivalet</h4>
                  <p>Create Visit</p>
                </div>
              </div>
            </DialogTitle>
            <DialogContent style={{ width: "105%" }}>
              <div className="form-body">
                <div
                  className="input-field"
                  style={{ gridColumnEnd: "span 2", position: "relative" }}
                >
                  <Label required htmlFor={"email-input"}>
                    Visitor Email
                  </Label>
                  <Input
                    type="email"
                    id={"email-input"}
                    appearance="filled-darker"
                    className="e"
                    aria-invalid={errors.email ? "true" : "false"}
                    {...register("email", {
                      required: "This is a required field.",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, // Email regex pattern
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="error-message">
                      {errors?.email?.message?.toString()}
                    </p>
                  )}
                </div>
                <div className="input-field">
                  <Label required htmlFor={"fname-input"}>
                    Title/First Name
                  </Label>
                  <div className="title-fname-container">
                    <Dropdown
                      appearance="filled-darker"
                      required
                      className="title-dropdown"
                      {...register("title", {
                        required: "This is a required field.",
                      })}
                      onOptionSelect={(_, data) => {
                        setValue("title", data.optionValue!);
                        trigger("title");
                      }}
                    >
                      {titleOptions.map((option) => (
                        <Option key={option} value={option}>
                          {option}
                        </Option>
                      ))}
                    </Dropdown>
                    <Input
                      // required
                      type="text"
                      maxLength={50}
                      id={"fname-input"}
                      appearance="filled-darker"
                      {...register("fname", {
                        required: "This is a required field.",
                      })}
                    />
                  </div>
                  {(errors.fname || errors.title) && (
                    <p className="error-message">
                      {errors?.fname?.message
                        ? errors?.fname?.message?.toString()
                        : errors?.title?.message?.toString()}
                    </p>
                  )}
                </div>
                <div className="input-field">
                  <Label required htmlFor={"lname-input"}>
                    Last Name
                  </Label>
                  <Input
                    // required
                    type="text"
                    id={"lname-input"}
                    appearance="filled-darker"
                    maxLength={30}
                    // onChange={(e) => setPurpose(e.target.value)}
                    {...register("lname", {
                      required: "This is a required field.",
                    })}
                  />
                  {errors.lname && (
                    <p className="error-message">
                      {errors?.lname?.message?.toString()}
                    </p>
                  )}
                </div>
                <div className="input-field">
                  <Label required htmlFor={"meeting-input"}>
                    Meeting Location
                  </Label>
                  <Dropdown
                    appearance="filled-darker"
                    id="dropdown-id"
                    placeholder="Meeting Location"
                    // clearable
                    className="visit-type-dropdown"
                    listbox={{ className: "dropdown-listbox" }}
                    positioning={"below"}
                    {...register("locationName", {
                      required: "This is a required field.",
                    })}
                    onOptionSelect={(_, data) => {
                      setValue("locationName", data.optionText!);
                      setValue("locationId", data.optionValue!);
                      trigger("locationName");
                    }}
                  >
                    {loadingVisitorTypesData
                      ? "Loading..."
                      : visitorLocationsData?.getPropertyLocations?.records.map(
                          (option: VisitorType) => (
                            <Option
                              key={option.name}
                              text={option.name}
                              value={option.id}
                            >
                              <span className="option-text">{option.name}</span>
                            </Option>
                          )
                        )}
                  </Dropdown>
                  {errors.locationName && (
                    <p className="error-message">
                      {errors?.locationName?.message?.toString()}
                    </p>
                  )}
                </div>
                <div className="input-field">
                  <Label required htmlFor="dropdown-id">
                    Visit Type
                  </Label>
                  <Dropdown
                    className="visit-type-dropdown"
                    appearance="filled-darker"
                    id="dropdown-id"
                    placeholder="Visit Type"
                    positioning={"below"}
                    listbox={{ className: "dropdown-listbox" }}
                    clearable
                    {...register("officeVisitorType", {
                      required: "This is a required field.",
                    })}
                    onOptionSelect={(_, data) => {
                      console.log(data.optionValue);
                      setValue("officeVisitorType", data.optionValue!);
                      trigger("officeVisitorType");
                      setVisitType(data.optionValue!);
                    }}
                  >
                    {loadingVisitorLocationsData
                      ? "Loading..."
                      : visitorTypesData?.getOfficeVisitorTypes?.records.map(
                          (option: VisitorLocationType) => (
                            <Option
                              key={option.name}
                              text={option.name}
                              value={option.id}
                            >
                              <span className="option-text">{option.name}</span>
                            </Option>
                          )
                        )}
                  </Dropdown>
                  {errors.officeVisitorType && (
                    <p className="error-message">
                      {errors?.officeVisitorType?.message?.toString()}
                    </p>
                  )}
                </div>
                <div className="input-field">
                  <Field required label="Date">
                    <DatePicker
                      appearance="filled-darker"
                      isMonthPickerVisible={false}
                      placeholder="Select a date..."
                      {...register("startDate", {
                        required: "This is a required field.",
                      })}
                      onSelectDate={() => trigger("startDate")}
                    />
                  </Field>
                  {errors.startDate && (
                    <p className="error-message">
                      {errors?.startDate?.message?.toString()}
                    </p>
                  )}
                </div>
                <div className="input-field">
                  <Label required htmlFor={"time-input"}>
                    Time
                  </Label>
                  {/* <Input
                    required
                    type="time"
                    id={"time-input"}
                    appearance="filled-darker"
                    onChange={(e) => setPurpose(e.target.value)}
                  /> */}
                  <Field>
                    <TimePicker
                      hourCycle="h12"
                      // required
                      // defaultSelectedTime={new Date()}
                      // clearable
                      // increment={1}
                      appearance="filled-darker"
                      {...register("startTime", {
                        required: "This is a required field.",
                      })}
                      onTimeChange={() => trigger("startTime")}
                    />
                  </Field>
                  {errors.startTime && (
                    <p className="error-message">
                      {errors?.startTime?.message?.toString()}
                    </p>
                  )}
                </div>
                {customFieldsData?.getCustomFields &&
                  customFieldsData?.getCustomFields.map(
                    (field: any, index: number) => (
                      <div className="input-field" key={index}>
                        <Label required={!field.isOptional} htmlFor={field?.id}>
                          {field.label}
                        </Label>
                        <Input
                          required={!field?.isOptional}
                          type={field?.fieldType}
                          id={field?.id}
                          appearance="filled-darker"
                          placeholder={field?.label}
                          {...register(`${field?.id}`, {
                            required: {
                              value: !field?.isOptional,
                              message: "This is a required field.",
                            },
                          })}
                        />
                        {!field?.isOptional && errors.startTime && (
                          <p className="error-message">
                            {errors?.startTime?.message?.toString()}
                          </p>
                        )}
                      </div>
                    )
                  )}
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                type="submit"
                appearance="primary"
                disabled={isSubmittingForm}
              >
                {isSubmittingForm ? "Creating..." : "Create"}
              </Button>
            </DialogActions>
          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
  );
};
