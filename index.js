import {
  Button,
  StyleSheet,
  Text,
  View,
  unstable_batchedUpdates,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { shallow } from "zustand/shallow";
import { useAppPersistStore, useBearStore, useZustandStore } from "src/store";

function func() {
  // Getting non-reactive fresh state
  const bears = useBearStore.getState().bears;
  // Listening to all changes, fires synchronously on every change
  // const unsub1 = useBearStore.subscribe(console.log);
  // Updating state, will trigger listeners

  /**
   *
   * Because React handles setState synchronously if it's called outside an event handler, updating the state outside an event handler
   * will force react to update the components synchronously. Therefore, there is a risk of encountering the zombie-child effect.
   * In order to fix this, the action needs to be wrapped in unstable_batchedUpdates like so:
   *
   */

  unstable_batchedUpdates(() => {
    useBearStore.setState((p) => {
      return { bears: p.bears + 1 };
    });
  });
  // Unsubscribe listeners
  // unsub1();

  console.log(bears, "bears");
}

const index = () => {
  // Object pick, re-renders the component when either state.nuts or state.honey change
  const {
    bears,
    increasePopulation,
    decreasePopulation,
    removeAllBears,
    anyAction,
  } = useBearStore((state: any) => state);

  const { addBear, eatFish, fishes } = useZustandStore((state) => state);
  //  here we have our mmkv and zustand persist-middleware hook that we have initialized previously
  const { isDarkTheme, setIsDarkTheme, count, increaseCount } =
    useAppPersistStore();
  const hasHydrated = useAppPersistStore.persist.hasHydrated();

  console.log(hasHydrated, "hasHydrated");

  return (
    <SafeAreaView>
      <Text
        style={{
          textAlign: "center",
          fontSize: 14,
          fontWeight: "bold",
          lineHeight: 50,
        }}
      >
        Count {count}
      </Text>
      <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}>
        {isDarkTheme ? "Dark Theme" : "Light theme"}
      </Text>
      <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}>
        isHydrated
      </Text>

      {/* <Button title="increasePopulation" onPress={increasePopulation} />
        <Button title="decreasePopulation " onPress={decreasePopulation} />
        <Button title="removeAllBears" onPress={removeAllBears} />
        <Button title="anyAction" onPress={anyAction} />
        <Button title="non-reactive" onPress={func} />
        <Button title="addBear" onPress={addBear} />
        <Button title="eatFish" onPress={eatFish} /> */}
      <Button title="set Count" onPress={increaseCount} />
      <Button
        onPress={() => setIsDarkTheme(!isDarkTheme)}
        title={isDarkTheme ? "Dark Theme" : "Light theme"}
      />
      {/* <ChildComp /> */}
    </SafeAreaView>
  );
};

function ChildComp() {
  const { test } = useBearStore((state: any) => state, shallow);
  console.log(test, "test");
  return <Text>Child {test}</Text>;
}

export default index;

const styles = StyleSheet.create({});

// =============================================================================
// Using MMKV Listners
// =============================================================================

// import React from "react";
// import {Button} from "react-native";
// import {MMKV} from "react-native-mmkv";
// import {SafeAreaView} from "react-native-safe-area-context";

// const storage = new MMKV({id: "theme-preference"});

// const index: React.FC = () => {
//   const [isDarkTheme, setIsDarkTheme] = React.useState(false);

//   React.useEffect(() => {
//     const listener = storage.addOnValueChangedListener(changedKey => {
//       const newValue = storage.getString(changedKey);

//       if (changedKey === "isDarkTheme") {
//         // update the theme in the app based on the updated value in the storage
//         console.log(`New theme preference: ${newValue}`);
//       }
//     });

//     return () => {
//       listener.remove();
//     };
//   }, []);

//   const toggleTheme = () => {
//     const newPreference = !isDarkTheme;
//     setIsDarkTheme(newPreference);
//     storage.set("isDarkTheme", JSON.stringify(newPreference));
//   };

//   return (
//     <SafeAreaView>
//       <Button
//         onPress={toggleTheme}
//         title={isDarkTheme ? "Dark Theme" : "Light Theme"}
//       />
//     </SafeAreaView>
//   );
// };

// export default index;
