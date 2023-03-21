import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';


const LAYER_API_URL = "http://localhost:3001/layers";

const LayerForm = ({ onCreate }) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const myUuid = uuidv4();

    const { TextArea } = Input;
    const onFinish = async (values) => {
        console.log("@$#33333333333333333333333333333333333")
        values.id = myUuid;
        values.data = JSON.parse(values.data.replace(/\n/g, ''))
        setIsSubmitting(true);
        console.log("@$#222 values", values)

        try {
            const response = await axios.post(`${LAYER_API_URL}`, values);
            const layer = response.data;
            message.success("Layer created successfully!");
            //   onCreate(values);
            onCreate(layer);
            form.resetFields();
        } catch (error) {
            console.error(error);
            message.error("Failed to create layer");
        }
        setIsSubmitting(false);
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <Form
            form={form}
            name="layer-form"
            layout="inline"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="Name"
                name="name"
                rules={[
                    {
                        required: true,
                        message: "Please enter a name for the layer",
                    },
                ]}
            >
                <Input placeholder="Enter layer value" />
            </Form.Item>
            <Form.Item
                label="Data"
                name="data"
                rules={[
                    {
                        required: true,
                        message: "Please enter a data for the layer",
                    },
                ]}
            >
                <TextArea rows={4} placeholder="Enter layer name" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                    Create Layer
                </Button>
            </Form.Item>
        </Form>
    );
};

export default LayerForm;
