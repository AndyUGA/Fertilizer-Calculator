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
      gradeData: [["Grade", "Match", "N", "P", "K", "N", "P", "K", "Score"], ["10-10-10", 800, 80, 80, 80, 20, 0, 20, 93]],

      basicArray: [["A", 95, 3], ["B", 100, 1], ["C", 75, 2]],

      NPKLabel: ["", "N", "P", "K"],
      pLabel: "P",
      kLabel: "K",
      nLabel: "N",
      matchValueLabel: "Match Value",
      matchPValue: 800,
      matchKValue: 1000,
      matchNValue: 600
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
    let tempArray = this.state.basicArray.sort(function(a, b) {
      return b[1] - a[1];
    });
    this.setState({
      basicArray: tempArray
    });
  }

  switch() {
    this.setState({
      gradeData: this.state.testData
    });
  }

  render() {
    const state = this.state;

    const sd1 = [[state.basicArray[0][1]], [state.basicArray[1][1]], [state.basicArray[2][1]]];

    return (
      <Container>
        <Content>
          <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
            <Rows data={state.gradeData} widthArr={state.widthArr} textStyle={styles.text} />
          </Table>
          <Button onPress={() => this.setState(this.sortArray())}>
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
