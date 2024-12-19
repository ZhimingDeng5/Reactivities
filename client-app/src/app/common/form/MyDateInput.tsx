import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";
import DatePicker from "react-datepicker";

interface DatePickerProps {
    name?: string;
    placeholder?: string;
    timeCaption?:string
    dateFormat?: string;
    isClearable?: boolean;
    showTimeSelect?: boolean;
    timeIntervals?: number;
    onChange?: (date: Date | null) => void;
    selected?: Date | null;
}

export default function MyDateInput(props: DatePickerProps) {
    const [field, meta, helpers] = useField(props.name!);
    
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <DatePicker
                {...field}
                {...props}
                popperPlacement="bottom-start"
                selected={(field.value) ? new Date(field.value) : null}
                onChange={value => helpers.setValue(value)}
            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    );
}