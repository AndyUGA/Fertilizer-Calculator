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
      isChecked: false,
      NPKLabel: [["N", "P", "K"]],
      inputData: [
        [
          <Item>
            <TextInput
              defaultValue="60"
              placeholder="Enter N value"
              onChangeText={inputtedValue => {
                this.updateNValue(inputtedValue), this.clearValues();
              }}
            />
          </Item>,
          <Item>
            <TextInput
              defaultValue="80"
              placeholder="Enter P value"
              onChangeText={inputtedValue => {
                this.updatePValue(inputtedValue), this.clearValues();
              }}
            />
          </Item>,
          <Item>
            <TextInput
              defaultValue="100"
              placeholder="Enter K value"
              onChangeText={inputtedValue => {
                this.updateKValue(inputtedValue), this.clearValues();
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
              this.updateAcreValue(inputtedValue);
            }}
          />
        ]
      ],
      caclulatedValue: [[0, 0, 0]],
      nutrientsSuppliedLabel: [["Nutrients supplied", "Nutrients surplus or deficit"]],
      //gradeData: [["N", "P", "K", "N", "P", "K", "Score"], [1.38, 1.38, 1.38, 0.0, 0.46, 0.92, 87], [1.84, 1.84, 1.84, 0.46, 0.0, 0.46, 93]],
      gradeData: [["N", "P", "K", "N", "P", "K", "Score"]],
      calculatedValues: [[]],
      widthArr: [160, 215],
      defaultUnits: "Pounds-Square Feet",
      poundsOrOunces: "",
      sfOrAcres: "",
      tempFactor: 0,
      currentArea: 1000,
      nResult: 0,
      pResult: 0,
      kResult: 0,
      nArea: 0,
      pArea: 0,
      kArea: 0,
      testString: "Hello",
      testString2: "World",
      selectedGrade: [],
      fullGrade: "",
      matchN: 0,
      matchP: 0,
      matchK: 0,
      suppliedNum1: 0,
      suppliedNum2: 0,
      suppliedNum3: 0,

      suppliedNum4: 0,
      suppliedNum5: 0,
      suppliedNum6: 0,

      suppliedNum7: 0,
      suppliedNum8: 0,
      suppliedNum9: 0,
      score1: 0,
      score2: 0,
      score3: 0,

      valueArray: [["A", 10], ["B", 5], ["C", 8]]
    };
  }

  sortArray() {
    let tempArray = this.state.calculatedValues.sort(function(a, b) {
      return b[6] - a[6];
    });

    let fooArray = this.state.valueArray.sort(function(a, b) {
      return a[1] - b[1];
    });
    this.setState({
      calculatedValues: tempArray,
      valueArray: fooArray
    });
  }

  //Update value of acre amount
  updateAcreValue(inputtedValue) {
    this.setState(
      {
        currentArea: inputtedValue
      },
      () => {
        this.calculateAcreValue();
      }
    );
  }

  //Update value of N
  updateNValue(value) {
    this.setState(
      {
        currentNValue: value
      },
      () => {
        this.parseSelectedGrade("10-10-10");
      }
    );
  }

  //Update value of P
  updatePValue(value) {
    this.setState(
      {
        currentPValue: value
      },
      () => {
        this.parseSelectedGrade("10-10-10");
      }
    );
  }

  //Update value of K
  updateKValue(value) {
    this.setState(
      {
        currentKValue: value
      },
      () => {
        this.parseSelectedGrade("10-10-10");
      }
    );
  }

  //Calculate values relating to pounds per square feet
  calculateAcreValue() {
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

    this.setState({
      poundsOrOunces: poundsOrOunces,
      tempFactor: factor,
      sfOrAcres: sfOrAcres,
      nResult: this.state.currentNValue / factor,
      pResult: this.state.currentPValue / factor,
      kResult: this.state.currentKValue / factor,

      caclulatedValue: [[, (this.state.currentNValue / factor).toFixed(2), (this.state.currentPValue / factor).toFixed(2), (this.state.currentKValue / factor).toFixed(2)]]
    });
  }

  //Gets values from selected grade
  parseSelectedGrade(grade) {
    /*
      Split the selected grades
      Ex: 10-10-10 will become
      gradeOne = 10
      gradeTwo = 10
      gradeThree = 10
    */
    this.state.selectedGrade = grade.split("-");

    let gradeOne = +this.state.selectedGrade[0];
    let gradeTwo = +this.state.selectedGrade[1];
    let gradeThree = +this.state.selectedGrade[2];

    let matchN = gradeOne ? Math.ceil((this.state.currentNValue / gradeOne) * 100) : 0;
    let matchP = gradeTwo ? Math.ceil((this.state.currentPValue / gradeTwo) * 100) : 0;
    let matchK = gradeThree ? Math.ceil((this.state.currentKValue / gradeThree) * 100) : 0;

    /*
    if (this.state.isChecked == true) {
      this.setState({
        calculatedValues: [[], [], [], [], [], []]
      });
    }
    */

    this.setState(
      {
        isChecked: !this.state.isChecked,
        fullGrade: grade,
        matchN: matchN,
        matchP: matchP,
        matchK: matchK
      },
      () => {
        //  if (this.state.isChecked == true) {
        this.calculateAcreValue();
        this.calculateScore();
        //  }
      }
    );
  }

  //Calculate values to calculate final score
  calculateScore() {
    this.setState(
      {
        suppliedNum1: supplied(+this.state.matchN, +this.state.selectedGrade[0]),
        suppliedNum2: supplied(+this.state.matchN, +this.state.selectedGrade[1]),
        suppliedNum3: supplied(+this.state.matchN, +this.state.selectedGrade[2]),

        suppliedNum4: supplied(+this.state.matchP, +this.state.selectedGrade[0]),
        suppliedNum5: supplied(+this.state.matchP, +this.state.selectedGrade[1]),
        suppliedNum6: supplied(+this.state.matchP, +this.state.selectedGrade[2]),

        suppliedNum7: supplied(+this.state.matchK, +this.state.selectedGrade[0]),
        suppliedNum8: supplied(+this.state.matchK, +this.state.selectedGrade[1]),
        suppliedNum9: supplied(+this.state.matchK, +this.state.selectedGrade[2])
      },
      () => {
        this.calculateFinalScore();
      }
    );
  }

  //Calculates final scores based on parameters
  calculateFinalScore() {
    this.setState(
      {
        score1: calculateIndividualScore(this.state.suppliedNum1, this.state.suppliedNum2, this.state.suppliedNum3, +this.state.currentNValue, +this.state.currentPValue, +this.state.currentKValue),
        score2: calculateIndividualScore(this.state.suppliedNum4, this.state.suppliedNum5, this.state.suppliedNum6, +this.state.currentNValue, +this.state.currentPValue, +this.state.currentKValue),
        score3: calculateIndividualScore(this.state.suppliedNum7, this.state.suppliedNum8, this.state.suppliedNum9, +this.state.currentNValue, +this.state.currentPValue, +this.state.currentKValue)
      },
      () => {
        this.calculateValues();
      }
    );
  }

  //Calculating values relating to each row of data and storing into array
  calculateValues() {
    let nResult = this.state.nResult;
    let pResult = this.state.pResult;
    let kResult = this.state.kResult;

    this.state.nArea = ((nResult / this.state.selectedGrade[0]) * 100).toFixed(2);
    this.state.pArea = ((pResult / this.state.selectedGrade[1]) * 100).toFixed(2);
    this.state.kArea = ((kResult / this.state.selectedGrade[2]) * 100).toFixed(2);

    //nsd = Nutrients Surplus or Deficit
    let NSD1 = nResult - nResult;
    let PSD1 = nResult - pResult;
    let KSD1 = nResult - kResult;

    let NSD2 = pResult - nResult;
    let PSD2 = pResult - pResult;
    let KSD2 = pResult - kResult;

    let NSD3 = kResult - nResult;
    let PSD3 = kResult - pResult;
    let KSD3 = kResult - kResult;

    let nLabel = ["Apply " + this.state.nArea + " " + this.state.poundsOrOunces + " of " + this.state.fullGrade + " per " + this.state.currentArea + " " + this.state.sfOrAcres];
    let nValues = [this.state.nResult.toFixed(2), this.state.nResult.toFixed(2), this.state.nResult.toFixed(2), NSD1.toFixed(2), PSD1.toFixed(2), KSD1.toFixed(2), this.state.score1];
    if (this.state.nArea == "Infinity") {
      nLabel = null;
      nValues = null;
    }

    let pLabel = ["Apply " + this.state.pArea + " " + this.state.poundsOrOunces + " of " + this.state.fullGrade + " per " + this.state.currentArea + " " + this.state.sfOrAcres];
    let pValues = [this.state.pResult.toFixed(2), this.state.pResult.toFixed(2), this.state.pResult.toFixed(2), NSD2.toFixed(2), PSD2.toFixed(2), KSD2.toFixed(2), this.state.score2];

    if (this.state.pArea == "Infinity") {
      pLabel = null;
      pValues = null;
    }

    let kLabel = ["Apply " + this.state.kArea + " " + this.state.poundsOrOunces + " of " + this.state.fullGrade + " per " + this.state.currentArea + " " + this.state.sfOrAcres];
    let kValues = [this.state.kResult.toFixed(2), this.state.kResult.toFixed(2), this.state.kResult.toFixed(2), NSD3.toFixed(2), PSD3.toFixed(2), KSD3.toFixed(2), this.state.score3 - 1];

    if (this.state.kArea == "Infinity") {
      kLabel = null;
      kValues = null;
    }

    this.setState({
      calculatedValues: [...this.state.calculatedValues, nLabel, nValues, pLabel, pValues, kLabel, kValues]
    });
  }

  clearValues() {
    this.setState({
      calculatedValues: [[]]
    });
  }

  render() {
    const state = this.state;

    //const sd1 = [[state.basicArray[0][1]], [state.basicArray[1][1]], [state.basicArray[2][1]]];

    return (
      <Container>
        <Content>
          <ListItem>
            <CheckBox onPress={() => this.setState(this.parseSelectedGrade("10-10-10"))} />
            <Body>
              <Text> 10 - 10 - 10</Text>
            </Body>
            <CheckBox onPress={() => this.setState(this.parseSelectedGrade("5-5-5"))} />
            <Body>
              <Text> 5 - 5 - 5</Text>
            </Body>
          </ListItem>
          <ListItem>
            <CheckBox onPress={() => this.setState(this.parseSelectedGrade("0-10-10"))} />
            <Body>
              <Text> 0 - 10 - 10</Text>
            </Body>
            <CheckBox onPress={() => this.setState(this.parseSelectedGrade("15-0-15"))} />
            <Body>
              <Text> 15 - 0 - 15</Text>
            </Body>
          </ListItem>

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
                    this.calculateAcreValue(), this.clearValues();
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
            <Rows data={state.calculatedValues} textStyle={styles.text} />
          </Table>
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
