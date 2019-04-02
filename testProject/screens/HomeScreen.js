/**
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from "react";
import { TextInput, StyleSheet, View } from "react-native";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from "react-native-table-component";
import { Container, Header, Content, Button, Text, Form, Item, Input, ListItem, CheckBox, Body, Icon, Picker } from "native-base";

import { rpd, calculateIndividualScore, supplied } from "./Helper.js";

export default class App extends Component {
  constructor(props) {
    super(props);
    let allowUserInput = false;

    this.state = {
      checkBoxOptions: (
        <ListItem>
          <CheckBox onPress={() => this.setState(this.sortArray(), this.calcuateAcreValue())} />
          <Body>
            <Text> 10 - 10 - 10</Text>
          </Body>
          <CheckBox onPress={() => this.setState(this.sortArray())} />
          <Body>
            <Text> 5 - 5 - 5</Text>
          </Body>
        </ListItem>
      ),
      checkBoxOptions2: (
        <ListItem>
          <CheckBox onPress={() => this.setState(this.sortArray())} />
          <Body>
            <Text> 0 - 10 - 10</Text>
          </Body>
          <CheckBox onPress={() => this.setState(this.sortArray())} />
          <Body>
            <Text> 15 - 0 - 15</Text>
          </Body>
        </ListItem>
      ),
      NPKLabel: [["N", "P", "K"]],
      inputData: [
        [
          <Item>
            <TextInput
              defaultValue="60"
              placeholder="Enter N value"
              onChangeText={inputtedValue => {
                this.updateNValue(inputtedValue);
              }}
            />
          </Item>,
          <Item>
            <TextInput
              defaultValue="80"
              placeholder="Enter P value"
              onChangeText={inputtedValue => {
                this.updatePValue(inputtedValue);
              }}
            />
          </Item>,
          <Item>
            <TextInput
              defaultValue="100"
              placeholder="Enter K value"
              onChangeText={inputtedValue => {
                this.updateKValue(inputtedValue);
              }}
              onEndEditing={inputtedValue => {}}
            />
          </Item>
        ]
      ],
      currentNValue: 60,
      currentPValue: 80,
      currentKValue: 100,
      area: [
        [
          <TextInput
            defaultValue="1000"
            placeholder="Enter value per acre"
            onChangeText={inputtedValue => {
              this.changeAcreValue(inputtedValue);
            }}
          />
        ]
      ],
      caclulatedValue: [[0, 0, 0]],
      nutrientsSuppliedLabel: [["Nutrients supplied", "Nutrients surplus or deficit"]],
      //gradeData: [["N", "P", "K", "N", "P", "K", "Score"], [1.38, 1.38, 1.38, 0.0, 0.46, 0.92, 87], [1.84, 1.84, 1.84, 0.46, 0.0, 0.46, 93]],
      gradeData: [["N", "P", "K", "N", "P", "K", "Score"]],
      gradeData2: [["0", "0", "0", "0", "0", "0"]],
      widthArr: [160, 160],
      basicArray: [["A", 95, 3], ["B", 100, 1], ["C", 75, 2]],
      nValue: 0,
      pValue: 0,
      kValue: 0,
      defaultUnits: "Pounds-Square Feet",
      poundsOrOunces: "",
      sfOrAcres: "",
      tempFactor: 0,
      currentArea: 1000,
      nResult: 0,
      pResult: 0,
      kResult: 0,
      foo: 0,
      testString: "Hello",
      testString2: "World"
    };
  }

  loadLoop() {
    let objs = [];

    for (let i = 0; i < 4; i++) {
      objs.push(i);
    }
    return objs;
  }

  sortArray() {
    let tempArray = this.state.gradeData.sort(function(a, b) {
      return b[6] - a[6];
    });
    this.setState({
      gradeData: tempArray
    });
  }

  changeAcreValue(inputtedValue) {
    this.setState({
      currentArea: inputtedValue
    });
  }

  updateNValue(value) {
    this.setState(
      {
        currentNValue: value
      },
      () => this.calcuateAcreValue()
    );
  }

  updatePValue(value) {
    this.setState(
      {
        currentPValue: value
      },
      () => this.calcuateAcreValue()
    );
  }

  updateKValue(value) {
    this.setState(
      {
        currentKValue: value
      },
      () => this.calcuateAcreValue()
    );
  }

  calcuateAcreValue() {
    let selectedUnits = this.state.defaultUnits.split("-");
    let poundsOrOunces = selectedUnits[0];
    let sfOrAcres = selectedUnits[1];
    let factor = 0;
    if (poundsOrOunces == "Pounds" && sfOrAcres == "Square Feet") {
      factor = 43560 / +this.state.currentArea;
    } else if (poundsOrOunces == "Pounds" && sfOrAcres == "Acre") {
      factor = 1 / +this.state.currentArea;
    } else if (poundsOrOunces == "Ounces" && sfOrAcres == "Square Feet") {
      factor = (0.0625 * 43560) / this.state.currentArea;
    } else if (poundsOrOunces == "Ounces" && sfOrAcres == "Acre") {
      factor = 0.0625 / this.state.currentArea;
    } else {
      factor = "Error";
    }

    this.setState(
      {
        poundsOrOunces: poundsOrOunces,
        tempFactor: factor,
        sfOrAcres: sfOrAcres,
        nResult: (this.state.currentNValue / factor).toFixed(2),
        pResult: (this.state.currentPValue / factor).toFixed(2),
        kResult: (this.state.currentKValue / factor).toFixed(2),

        caclulatedValue: [[, (this.state.currentNValue / factor).toFixed(2), (this.state.currentPValue / factor).toFixed(2), (this.state.currentKValue / factor).toFixed(2)]]
      },
      () => {
        this.calculateValues();
      }
    );
  }

  calculateValues() {
    //nsd = Nutrients Surplus or Deficit
    let nResult = this.state.nResult;
    let pResult = this.state.pResult;
    let kResult = this.state.kResult;

    this.state.foo = ((nResult / 10) * 100).toFixed(2);

    let nsdNValue = nResult - nResult;
    let nsdPValue = nResult - pResult;
    let nsdKValue = nResult - kResult;

    this.setState({
      gradeData2: [[this.state.nResult, this.state.nResult, this.state.nResult, nsdNValue.toFixed(2), nsdPValue.toFixed(2), nsdKValue.toFixed(2)]]
    });
  }

  render() {
    const state = this.state;

    //const sd1 = [[state.basicArray[0][1]], [state.basicArray[1][1]], [state.basicArray[2][1]]];

    return (
      <Container>
        <Content>
          {state.checkBoxOptions}
          {state.checkBoxOptions2}

          <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
            <Rows data={state.NPKLabel} textStyle={styles.text} />
            <Rows data={state.inputData} textStyle={styles.text} />
            <Form>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                selectedValue={state.defaultUnits}
                placeholder={state.defaultUnits}
                onValueChange={value => {
                  this.setState({ defaultUnits: value }, () => {
                    this.calcuateAcreValue();
                  });
                }}
              >
                <Picker.Item label="Pounds - Square Feet" value="Pounds-Square Feet" />
                <Picker.Item label="Pounds - Acre" value="Pounds-Acre" />
                <Picker.Item label="Ounces - Square Feet" value="Ounces-Square Feet" />
                <Picker.Item label="Ounces - Acre" value="Ounces-Acre" />
              </Picker>
            </Form>
            <Rows data={state.area} textStyle={styles.text} />
            <Rows data={state.caclulatedValue} textStyle={styles.text} />
            <Rows data={state.nutrientsSuppliedLabel} widthArr={state.widthArr} textStyle={styles.text} />
            <Rows data={state.gradeData} textStyle={styles.text} />
            <Rows data={state.gradeData2} textStyle={styles.text} />
          </Table>
          <Text> {state.poundsOrOunces}</Text>
          <Text> {state.sfOrAcres}</Text>
          <Text> {state.foo}</Text>
          <Text>
            {" "}
            This is {state.testString} and {state.testString2}
          </Text>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6, textAlign: "center" },
  red: { color: "red" },
  blue: { color: "blue" },
  green: { color: "green" }
});
