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
      testArray: [],
      testArray2: [],

      gradeData: [["Grade", "", "", ""]],
      matchData: [["Match", "P", "K", "N"]],

      testSplit: "",
      inputLabel: ["N", "P", "K"],
      gradeTitle: "Grade",
      grade1: "5-5-5",
      grade2: "10-10-10",
      grade3: "15-15-15",
      matchTitle: ["Match"],
      pLabel: "P",
      kLabel: "K",
      nLabel: "N",
      matchValueLabel: "Match Value",
      matchPValue: 800,
      matchKValue: 1000,
      matchNValue: 600
    };
  }

  switch() {
    this.setState({
      gradeData: [[this.state.gradeTitle, this.state.grade3, this.state.grade2, this.state.grade1]],
      matchData: [[this.state.matchTitle, this.state.nLabel, this.state.kLabel, this.state.pLabel]]
    });
  }

  render() {
    const state = this.state;

    let match2 = [[state.matchTitle, state.nLabel, state.kLabel, state.pLabel]];
    testArray = [state.grade1, "-4"];
    testArray2 = [state.grade2, "-3"];
    let matchValues = [[state.matchValueLabel, state.matchPValue, state.matchKValue, state.matchNValue]];

    return (
      <Container>
        <Content>
          <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
            <Rows data={state.gradeData} textStyle={styles.text} />
            <Rows data={state.matchData} textStyle={styles.text} />
          </Table>
          <Button onPress={() => this.setState(this.switch())}>
            <Text>Click Me!</Text>
          </Button>
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
