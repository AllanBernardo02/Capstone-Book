import { Button, Checkbox, Collapse, DatePicker } from "antd";
import React from "react";
import Layout from "../../components/Layout";
const DoctorSchedule = () => {
  const { Panel } = Collapse;
  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };
  return (
    <Layout>
      <h1>Doctor Schedule</h1>
      <hr />
      <DatePicker onChange={onChange} />
      <h2>Set Time</h2>
      <Collapse defaultActiveKey={["1"]} onChange={onChange}>
        <Panel header="AM" key="1">
          <Checkbox onChange={onChange}>9:00 - 9:20am</Checkbox>
          <Checkbox onChange={onChange}>9:20 - 9:40am</Checkbox>
          <Checkbox onChange={onChange}>9:40 - 10:00am</Checkbox>
          <Checkbox onChange={onChange}>10:00 - 10:20am</Checkbox>
        </Panel>
        <Panel header="PM" key="2">
          <Checkbox onChange={onChange}>1:00 - 1:20pm</Checkbox>
          <Checkbox onChange={onChange}>1:20 - 1:40pm</Checkbox>
          <Checkbox onChange={onChange}>1:40 - 2:00pm</Checkbox>
          <Checkbox onChange={onChange}>2:00 - 2:20pm</Checkbox>
        </Panel>
      </Collapse>

      <Button disabled>5:00 - 5:20pm</Button>
    </Layout>
  );
};

export default DoctorSchedule;
