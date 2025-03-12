import {
  Dialog,
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
import Logo from "../../assets/images/digivaletLogo.svg";
import {
  useCustomFields,
  useUpdateOfficeVisitorById,
} from "../../graphql/hooks/hooks";
import { Visitor } from "../../types";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export const EditFormModal = ({
  data,
  isVisitorEditModalOpen,
  setIsVisitorEditModalOpen,
}: {
  data: Visitor | undefined;
  isVisitorEditModalOpen: boolean;
  setIsVisitorEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const { customFieldsData } = useCustomFields(data?.officeVisitorType.id!);
  const {
    updateVisitorById,
    updateVisitorByIdError,
    loadingUpdateVisitorById,
  } = useUpdateOfficeVisitorById();

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const titleOptions = ["Mr", "Mrs", "Ms", "Miss"];

  useEffect(() => {
    setValue("title", data?.officeVisitor.title);
    trigger("title");
  }, []);

  const formValues = watch();

  useEffect(() => {
    const isChanged =
      formValues.title !== data?.officeVisitor.title ||
      formValues.fname !== data?.officeVisitor.fname ||
      formValues.lname !== data?.officeVisitor.lname;

    setIsFormChanged(isChanged);
  }, [formValues]);

  function onsubmit(formData: any) {
    // console.log(formData);
    setIsSubmittingForm(true);
    updateVisitorById(data?.officeVisitor.id!, formData, customFieldsData);
  }

  useEffect(() => {
    if (isSubmittingForm) {
      if (updateVisitorByIdError) {
        console.error("Error from backend:", updateVisitorByIdError);
        alert("Error from backend");
        setIsSubmittingForm(false);
      } else if (!updateVisitorByIdError) {
        reset();
        setIsVisitorEditModalOpen(false);
        setIsSubmittingForm(false);
      }
    }
  }, [updateVisitorByIdError, loadingUpdateVisitorById]);

  return (
    <Dialog
      modalType="non-modal"
      open={isVisitorEditModalOpen}
      onOpenChange={(_, { open }) => {
        setIsVisitorEditModalOpen(open), reset();
      }}
    >
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
                  <p>Update Visitor</p>
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
                    disabled
                    defaultValue={data?.officeVisitor.email}
                    type="email"
                    id={"email-input"}
                    appearance="filled-darker"
                  />
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
                      defaultValue={data?.officeVisitor.title}
                      defaultSelectedOptions={[data?.officeVisitor.title!]}
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
                      defaultValue={data?.officeVisitor.fname}
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
                    defaultValue={data?.officeVisitor.lname}
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
                    disabled
                    defaultValue={data?.locationName}
                    className="visit-type-dropdown"
                    listbox={{ className: "dropdown-listbox" }}
                    positioning={"below"}
                  ></Dropdown>
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
                    disabled
                    defaultValue={data?.officeVisitorType.name}
                    listbox={{ className: "dropdown-listbox" }}
                  ></Dropdown>
                </div>
                <div className="input-field">
                  <Field required label="Date">
                    <Input
                      disabled
                      appearance="filled-darker"
                      value={data?.startDate}
                    />
                  </Field>
                </div>
                <div className="input-field">
                  <Label required htmlFor={"time-input"}>
                    Time
                  </Label>
                  <Input
                    disabled
                    type="time"
                    id={"time-input"}
                    appearance="filled-darker"
                    value={data?.startTime}
                  />
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
                          value={field.value}
                          {...register(`${field?.id}`, {
                            required: {
                              value: !field?.isOptional,
                              message: "This is a required field.",
                            },
                          })}
                        />
                        {!field?.isOptional && errors[field?.id] && (
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
                disabled={isSubmittingForm || !isFormChanged}
              >
                {isSubmittingForm ? "Updating..." : "Update"}
              </Button>
            </DialogActions>
          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
  );
};
