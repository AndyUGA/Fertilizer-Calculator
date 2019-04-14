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
      gradeTenChecked: false,
      gradeZeroTenChecked: false,
      gradeFiveChecked: false,
      gradeFifteenChecked: false,
      NPkLabel1: [["N", "P", "K"]],
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
      nlabel1: null,
      nValues1: null,
      pLabel1: null,
      pValues1: null,
      kLabel1: null,
      kValues1: null,

      nlabel2: null,
      nValues2: null,
      pLabel2: null,
      pValues2: null,
      kLabel2: null,
      kValues2: null,

      nlabel3: null,
      nValues3: null,
      pLabel3: null,
      pValues3: null,
      kLabel3: null,
      kValues3: null,

      nlabel4: null,
      nValues4: null,
      pLabel4: null,
      pValues4: null,
      kLabel4: null,
      kValues4: null,

      valueArray: [["A", 10], ["B", 5], ["C", 8]],
      foo: 5,
      stay: true
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

    this.setState(
      {
        fullGrade: grade,
        matchN: matchN,
        matchP: matchP,
        matchK: matchK
      },
      () => {
        this.calculateAcreValue();
        this.calculateScore(grade);
      }
    );
  }

  //Calculate values to calculate final score
  calculateScore(grade) {
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
        this.calculateFinalScore(grade);
      }
    );
  }

  //Calculates final scores based on parameters
  calculateFinalScore(grade) {
    this.setState(
      {
        score1: calculateIndividualScore(this.state.suppliedNum1, this.state.suppliedNum2, this.state.suppliedNum3, +this.state.currentNValue, +this.state.currentPValue, +this.state.currentKValue),
        score2: calculateIndividualScore(this.state.suppliedNum4, this.state.suppliedNum5, this.state.suppliedNum6, +this.state.currentNValue, +this.state.currentPValue, +this.state.currentKValue),
        score3: calculateIndividualScore(this.state.suppliedNum7, this.state.suppliedNum8, this.state.suppliedNum9, +this.state.currentNValue, +this.state.currentPValue, +this.state.currentKValue)
      },
      () => {
        this.calculateValues(grade);
      }
    );
  }

  //Calculating values relating to each row of data and storing into array
  calculateValues(grade) {
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

    if (grade == "10-10-10") {
      if (this.state.gradeTenChecked) {
        this.state.nlabel1 = ["Apply " + this.state.nArea + " " + this.state.poundsOrOunces + " of " + this.state.fullGrade + " per " + this.state.currentArea + " " + this.state.sfOrAcres];
        this.state.nValues1 = [this.state.nResult.toFixed(2), this.state.nResult.toFixed(2), this.state.nResult.toFixed(2), NSD1.toFixed(2), PSD1.toFixed(2), KSD1.toFixed(2), this.state.score1];
        this.state.pLabel1 = ["Apply " + this.state.pArea + " " + this.state.poundsOrOunces + " of " + this.state.fullGrade + " per " + this.state.currentArea + " " + this.state.sfOrAcres];
        this.state.pValues1 = [this.state.pResult.toFixed(2), this.state.pResult.toFixed(2), this.state.pResult.toFixed(2), NSD2.toFixed(2), PSD2.toFixed(2), KSD2.toFixed(2), this.state.score2];
        this.state.kLabel1 = ["Apply " + this.state.kArea + " " + this.state.poundsOrOunces + " of " + this.state.fullGrade + " per " + this.state.currentArea + " " + this.state.sfOrAcres];
        this.state.kValues1 = [this.state.kResult.toFixed(2), this.state.kResult.toFixed(2), this.state.kResult.toFixed(2), NSD3.toFixed(2), PSD3.toFixed(2), KSD3.toFixed(2), this.state.score3 - 1];
      } else if (this.state.gradeTenChecked == false) {
        this.state.nlabel1 = null;
        this.state.nValues1 = null;
        this.state.pLabel1 = null;
        this.state.pValues1 = null;
        this.state.kLabel1 = null;
        this.state.kValues1 = null;
      }
    }
    if (grade == "5-5-5") {
      if (this.state.gradeFiveChecked) {
        this.state.nlabel2 = ["Apply " + this.state.nArea + " " + this.state.poundsOrOunces + " of " + this.state.fullGrade + " per " + this.state.currentArea + " " + this.state.sfOrAcres];
        this.state.nValues2 = [this.state.nResult.toFixed(2), this.state.nResult.toFixed(2), this.state.nResult.toFixed(2), NSD1.toFixed(2), PSD1.toFixed(2), KSD1.toFixed(2), this.state.score1];
        this.state.pLabel2 = ["Apply " + this.state.pArea + " " + this.state.poundsOrOunces + " of " + this.state.fullGrade + " per " + this.state.currentArea + " " + this.state.sfOrAcres];
        this.state.pValues2 = [this.state.pResult.toFixed(2), this.state.pResult.toFixed(2), this.state.pResult.toFixed(2), NSD2.toFixed(2), PSD2.toFixed(2), KSD2.toFixed(2), this.state.score2];
        this.state.kLabel2 = ["Apply " + this.state.kArea + " " + this.state.poundsOrOunces + " of " + this.state.fullGrade + " per " + this.state.currentArea + " " + this.state.sfOrAcres];
        this.state.kValues2 = [this.state.kResult.toFixed(2), this.state.kResult.toFixed(2), this.state.kResult.toFixed(2), NSD3.toFixed(2), PSD3.toFixed(2), KSD3.toFixed(2), this.state.score3 - 1];
      } else if (this.state.gradeFiveChecked == false) {
        this.state.nlabel2 = null;
        this.state.nValues2 = null;
        this.state.pLabel2 = null;
        this.state.pValues2 = null;
        this.state.kLabel2 = null;
        this.state.kValues2 = null;
      }
    }
    if (grade == "0-10-10") {
      if (this.state.gradeZeroTenChecked) {
        NSD2 = 0 - nResult;
        NSD3 = 0 - nResult;
        let zero = 0;
        this.state.nlabel3 = null;
        this.state.nValues3 = null;
        this.state.pLabel3 = ["Apply " + this.state.pArea + " " + this.state.poundsOrOunces + " of " + this.state.fullGrade + " per " + this.state.currentArea + " " + this.state.sfOrAcres];
        this.state.pValues3 = [zero.toFixed(2), this.state.pResult.toFixed(2), this.state.pResult.toFixed(2), NSD2.toFixed(2), PSD2.toFixed(2), KSD2.toFixed(2), this.state.score2];
        this.state.kLabel3 = ["Apply " + this.state.kArea + " " + this.state.poundsOrOunces + " of " + this.state.fullGrade + " per " + this.state.currentArea + " " + this.state.sfOrAcres];
        this.state.kValues3 = [zero.toFixed(2), this.state.kResult.toFixed(2), this.state.kResult.toFixed(2), NSD3.toFixed(2), PSD3.toFixed(2), KSD3.toFixed(2), this.state.score3 - 1];
      } else if (this.state.gradeZeroTenChecked == false) {
        this.state.nlabel3 = null;
        this.state.nValues3 = null;
        this.state.pLabel3 = null;
        this.state.pValues3 = null;
        this.state.kLabel3 = null;
        this.state.kValues3 = null;
      }
    }

    if (grade == "15-0-15") {
      PSD1 = 0 - pResult;
      PSD3 = 0 - pResult;
      if (this.state.gradeFifteenChecked) {
        let zero = 0;
        this.state.nlabel4 = ["Apply " + this.state.nArea + " " + this.state.poundsOrOunces + " of " + this.state.fullGrade + " per " + this.state.currentArea + " " + this.state.sfOrAcres];
        this.state.nValues4 = [this.state.nResult.toFixed(2), zero.toFixed(2), this.state.nResult.toFixed(2), NSD1.toFixed(2), PSD1.toFixed(2), KSD1.toFixed(2), this.state.score1];
        this.state.pLabel4 = null;
        this.state.pValues4 = null;
        this.state.kLabel4 = ["Apply " + this.state.kArea + " " + this.state.poundsOrOunces + " of " + this.state.fullGrade + " per " + this.state.currentArea + " " + this.state.sfOrAcres];
        this.state.kValues4 = [this.state.kResult.toFixed(2), zero.toFixed(2), this.state.kResult.toFixed(2), NSD3.toFixed(2), PSD3.toFixed(2), KSD3.toFixed(2), this.state.score3 - 1];
      } else if (this.state.gradeFifteenChecked == false) {
        this.state.nlabel4 = null;
        this.state.nValues4 = null;
        this.state.pLabel4 = null;
        this.state.pValues4 = null;
        this.state.kLabel4 = null;
        this.state.kValues4 = null;
      }
    }

    this.setState({
      //calculatedValues: [...this.state.calculatedValues, nlabel1, nValues1, pLabel1, pValues1, kLabel1, kValues1]
      calculatedValues: [
        this.state.nlabel1,
        this.state.nValues1,
        this.state.pLabel1,
        this.state.pValues1,
        this.state.kLabel1,
        this.state.kValues1,
        this.state.nlabel2,
        this.state.nValues2,
        this.state.pLabel2,
        this.state.pValues2,
        this.state.kLabel2,
        this.state.kValues2,
        this.state.nlabel3,
        this.state.nValues3,
        this.state.pLabel3,
        this.state.pValues3,
        this.state.kLabel3,
        this.state.kValues3,

        this.state.nlabel4,
        this.state.nValues4,
        this.state.pLabel4,
        this.state.pValues4,
        this.state.kLabel4,
        this.state.kValues4
      ]
    });
  }

  clearValues() {
    this.setState({
      calculatedValues: [[]]
    });
  }

  checkGradeTen() {
    this.setState({
      gradeTenChecked: !this.state.gradeTenChecked
    });
  }

  checkGradeFive() {
    this.setState({
      gradeFiveChecked: !this.state.gradeFiveChecked
    });
  }

  checkZeroTen() {
    this.setState({
      gradeZeroTenChecked: !this.state.gradeZeroTenChecked
    });
  }

  checkFifteen() {
    this.setState({
      gradeFifteenChecked: !this.state.gradeFifteenChecked
    });
  }

  render() {
    const state = this.state;

    //const sd1 = [[state.basicArray[0][1]], [state.basicArray[1][1]], [state.basicArray[2][1]]];

    return (
      <Container>
        <Content>
          <ListItem>
            <CheckBox checked={state.gradeTenChecked} onPress={() => this.setState(this.parseSelectedGrade("10-10-10"), this.checkGradeTen())} />
            <Body>
              <Text> 10 - 10 - 10</Text>
            </Body>
            <CheckBox checked={state.gradeFiveChecked} onPress={() => this.setState(this.parseSelectedGrade("5-5-5"), this.checkGradeFive())} />
            <Body>
              <Text> 5 - 5 - 5</Text>
            </Body>
          </ListItem>
          <ListItem>
            <CheckBox checked={state.gradeZeroTenChecked} onPress={() => this.setState(this.parseSelectedGrade("0-10-10"), this.checkZeroTen())} />
            <Body>
              <Text> 0 - 10 - 10</Text>
            </Body>
            <CheckBox checked={state.gradeFifteenChecked} onPress={() => this.setState(this.parseSelectedGrade("15-0-15"), this.checkFifteen())} />
            <Body>
              <Text> 15 - 0 - 15</Text>
            </Body>
          </ListItem>

          <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
            <Rows data={state.NPkLabel1} textStyle={styles.text} />
            <Rows
              data={[
                [
                  <Item>
                    <TextInput
                      editable={!state.gradeTenChecked && !state.gradeFiveChecked && !state.gradeZeroTenChecked && !state.gradeFifteenChecked}
                      defaultValue="60"
                      placeholder="Enter N value"
                      onChangeText={inputtedValue => {
                        this.updateNValue(inputtedValue), this.clearValues();
                      }}
                    />
                  </Item>,
                  <Item>
                    <TextInput
                      editable={!state.gradeTenChecked && !state.gradeFiveChecked && !state.gradeZeroTenChecked && !state.gradeFifteenChecked}
                      defaultValue="80"
                      placeholder="Enter P value"
                      onChangeText={inputtedValue => {
                        this.updatePValue(inputtedValue), this.clearValues();
                      }}
                    />
                  </Item>,
                  <Item>
                    <TextInput
                      editable={!state.gradeTenChecked && !state.gradeFiveChecked && !state.gradeZeroTenChecked && !state.gradeFifteenChecked}
                      defaultValue="100"
                      placeholder="Enter K value"
                      onChangeText={inputtedValue => {
                        this.updateKValue(inputtedValue), this.clearValues();
                      }}
                      onEndEditing={inputtedValue => {}}
                    />
                  </Item>
                ]
              ]}
              textStyle={styles.text}
            />
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
