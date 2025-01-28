import React, { useState, useEffect } from "react";
import { Text, View, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, StackScreenProps } from "@react-navigation/stack";
import { TailwindProvider, useTailwind } from "tailwind-rn";
import utilities from "./tailwind.json";

type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

type RootStackParamList = {
  TaskList: undefined;
  TaskDetails: { task: Task };
};

const mockApi: Task[] = [
  { id: "1", title: "Task 1", description: "This is task 1", completed: false },
  { id: "2", title: "Task 2", description: "This is task 2", completed: false },
  { id: "3", title: "Task 3", description: "This is task 3", completed: true },
];

const TaskListScreen: React.FC<StackScreenProps<RootStackParamList, "TaskList">> = ({ navigation }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const tailwind = useTailwind();

  useEffect(() => {
    setTimeout(() => {
      setTasks(mockApi);
      setLoading(false);
    }, 1000); // Simulating API delay
  }, []);

  if (loading) {
    return (
      <View style={tailwind("flex-1 justify-center items-center")}>
        <ActivityIndicator size="large" color="#00f" />
      </View>
    );
  }

  return (
    <View style={tailwind("flex-1 p-4 bg-gray-100")}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={tailwind("p-4 bg-white rounded-lg mb-2 shadow")}
            onPress={() => navigation.navigate("TaskDetails", { task: item })}
          >
            <Text style={tailwind("text-lg font-bold")}>{item.title}</Text>
            <Text style={tailwind("text-gray-500")}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const TaskDetailsScreen: React.FC<StackScreenProps<RootStackParamList, "TaskDetails">> = ({ route }) => {
  const { task } = route.params;
  const tailwind = useTailwind();

  return (
    <View style={tailwind("flex-1 p-4 bg-gray-100")}>
      <Text style={tailwind("text-2xl font-bold mb-2")}>{task.title}</Text>
      <Text style={tailwind("text-gray-600 mb-4")}>{task.description}</Text>
      <Text style={tailwind("text-lg")}>
        Status: {task.completed ? "Completed" : "Incomplete"}
      </Text>
    </View>
  );
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <TailwindProvider utilities={utilities}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: "Tasks" }} />
          <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} options={{ title: "Task Details" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </TailwindProvider>
  );
};

export default App;
