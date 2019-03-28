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
      gradeData: [["N", "P", "K", "N", "P", "K", "Score"], [1.38, 1.38, 1.38, 0.0, 0.46, 0.92, 87], [1.84, 1.84, 1.84, 0.46, 0.0, 0.46, 93]],
      nutrientsSuppliedLabel: [["Nutrients supplied", "Nutrients surplus or deficit"]],
      basicArray: [["A", 95, 3], ["B", 100, 1], ["C", 75, 2]]
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
      return b[8] - a[8];
    });
    this.setState({
      gradeData: tempArray
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
          <ListItem>
            <CheckBox onPress={() => this.setState(this.sortArray())} />
            <Body>
              <Text> 10 - 10 - 10</Text>
            </Body>
            <CheckBox onPress={() => this.setState(this.sortArray())} />
            <Body>
              <Text> 5 - 5 - 5</Text>
            </Body>
          </ListItem>
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
          <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
            <Rows data={state.nutrientsSuppliedLabel} widthArr={state.widthArr} textStyle={styles.text} />
            <Rows data={state.gradeData} textStyle={styles.text} />
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
