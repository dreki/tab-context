import { Form, Input, Modal } from "antd";
import { observer } from "mobx-react";

export interface Values {
    name: string;
}

interface SessionCreationModalProps {
    onCreate: (values: Values) => void;
    onCancel: () => void;
}

export const SessionCreationModal = observer(function SessionCreationModal(
    props: SessionCreationModalProps
) {
    const [form] = Form.useForm();

    const onOk = async () => {
        try {
            const values: Values = await form.validateFields();
            props.onCreate(values);
        }
        catch (error) {
            console.log("Failed to validate fields");
            return;
        }
    };

    return (
        <>
            <Modal
                title="Create Session"
                open={true}
                okText="Create"
                onOk={onOk}
                onCancel={props.onCancel}
            >
                <Form form={form} layout="vertical" name="form_in_modal">
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[
                            {
                                required: true,
                                message: "Please input the name of the session",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
});
