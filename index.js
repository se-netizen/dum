import firebaseAdmin from "firebase-admin";
import fs from "fs";

const initFirebase = async () => {
  const serviceAccount = JSON.parse(
    fs.readFileSync(
      new URL("./serviceAccountKey.json", import.meta.url),
      "utf-8"
    )
  );

  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL:
      "https://securin-b49ed-default-rtdb.asia-southeast1.firebasedatabase.app",
  });

  return firebaseAdmin.database();
};

const generateDummyData = () => {
  const timestamp = Math.floor(Date.now() / 1000); // current Unix timestamp (detik)

  return {
    detection: {
      drowsiness: {
        status_code: 0,
        timestamp,
      },
      face_detection: {
        status: 0,
        timestamp,
      },
    },
    location: {
      lat: -7.28563,
      lng: 112.801139333333,
      timestamp,
    },
    master_switch: {
      value: false,
      timestamp,
    },
    monitoring: {
      acceleration: {
        x: 0.1726,
        y: -0.1547,
        z: 0.656,
        timestamp,
      },
      gyroscope: {
        x: -18.458,
        y: 77.3282,
        z: 0.3358,
        timestamp,
      },
    },
    state: {
      status: "park",
      timestamp,
    },
  };
};

async function main() {
  const db = await initFirebase();
  const ref = db.ref("vehicle/SUPRAX125");

  setInterval(async () => {
    const data = generateDummyData();
    await ref.set(data);
    console.log("Dummy data sent to Firebase at", new Date().toISOString());
  }, 6000); // setiap 1 menit
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
