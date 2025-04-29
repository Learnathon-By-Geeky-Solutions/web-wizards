import React, { useState } from 'react';
import GenericTestResult from './GenericTestResult';

const TestResultExample = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Example test result data that follows the structure of your backend model
  const exampleTestResults = [
    {
      test_type: {
        id: "cbc-1",
        name: "Complete Blood Count",
        code: "CBC",
        description: "Complete blood count with differential",
        category: "Hematology"
      },
      parameters: [
        {
          parameter_name: "Hemoglobin",
          parameter_code: "hemoglobin",
          parameter_unit: "g/dL",
          data_type: "numeric",
          reference_range: { min: 12.0, max: 16.0 },
          data_points: [
            { date: "2025-01-15T10:00:00Z", value: 13.8, is_abnormal: false },
            { date: "2025-02-20T10:00:00Z", value: 14.0, is_abnormal: false },
            { date: "2025-03-28T10:00:00Z", value: 14.2, is_abnormal: false }
          ]
        },
        {
          parameter_name: "Red Blood Cells",
          parameter_code: "red_blood_cells",
          parameter_unit: "10^6/μL",
          data_type: "numeric",
          reference_range: { min: 4.2, max: 5.4 },
          data_points: [
            { date: "2025-01-15T10:00:00Z", value: 4.9, is_abnormal: false },
            { date: "2025-02-20T10:00:00Z", value: 5.0, is_abnormal: false },
            { date: "2025-03-28T10:00:00Z", value: 5.1, is_abnormal: false }
          ]
        },
        {
          parameter_name: "White Blood Cells",
          parameter_code: "white_blood_cells",
          parameter_unit: "10^3/μL",
          data_type: "numeric",
          reference_range: { min: 4.5, max: 11.0 },
          data_points: [
            { date: "2025-01-15T10:00:00Z", value: 7.2, is_abnormal: false },
            { date: "2025-02-20T10:00:00Z", value: 7.4, is_abnormal: false },
            { date: "2025-03-28T10:00:00Z", value: 7.6, is_abnormal: false }
          ]
        }
      ]
    },
    {
      test_type: {
        id: "ure-1",
        name: "Urea & Electrolytes",
        code: "URE",
        description: "Basic metabolic panel",
        category: "Chemistry"
      },
      parameters: [
        {
          parameter_name: "Sodium",
          parameter_code: "sodium",
          parameter_unit: "mmol/L",
          data_type: "numeric",
          reference_range: { min: 135, max: 145 },
          data_points: [
            { date: "2025-01-15T10:00:00Z", value: 138, is_abnormal: false },
            { date: "2025-02-20T10:00:00Z", value: 139, is_abnormal: false },
            { date: "2025-03-28T10:00:00Z", value: 140, is_abnormal: false }
          ]
        },
        {
          parameter_name: "Potassium",
          parameter_code: "potassium",
          parameter_unit: "mmol/L",
          data_type: "numeric",
          reference_range: { min: 3.5, max: 5.0 },
          data_points: [
            { date: "2025-01-15T10:00:00Z", value: 4.0, is_abnormal: false },
            { date: "2025-02-20T10:00:00Z", value: 4.1, is_abnormal: false },
            { date: "2025-03-28T10:00:00Z", value: 4.2, is_abnormal: false }
          ]
        }
      ]
    },
    {
      test_type: {
        id: "us-1",
        name: "Abdominal Ultrasound",
        code: "US_ABD",
        description: "Ultrasound imaging of the abdominal organs",
        category: "Imaging"
      },
      parameters: [
        {
          parameter_name: "Ultrasound Report",
          parameter_code: "us_report",
          parameter_unit: "",
          data_type: "text",
          reference_range: {},
          data_points: [
            { 
              date: "2025-03-25T10:00:00Z", 
              value: `ABDOMINAL ULTRASONOGRAPHY REPORT

EXAMINATION:
Complete abdominal ultrasound examination performed on 25/03/2025.

CLINICAL HISTORY:
Patient with right upper quadrant pain, investigating for possible gallstones.

FINDINGS:
LIVER: Normal size, measuring 14.2 cm in the midclavicular line. Homogeneous echogenicity without focal lesions.

GALLBLADDER: Multiple mobile echogenic foci with posterior acoustic shadowing seen within the gallbladder, consistent with gallstones. Wall thickness is normal at 3mm. No pericholecystic fluid.

BILIARY TREE: Common bile duct measures 5mm, within normal limits. No intrahepatic biliary dilation.

PANCREAS: Normal appearance with no focal lesions. Main pancreatic duct not dilated.

SPLEEN: Normal size (10.2 cm) and echogenicity.

KIDNEYS: Both kidneys of normal size, position and echogenicity. Right kidney 10.8 cm, left kidney 11.2 cm. No hydronephrosis or calculi identified.

URINARY BLADDER: Partially filled, appears normal.

IMPRESSION:
Multiple gallstones without evidence of acute cholecystitis. Otherwise normal abdominal ultrasound examination.

RECOMMENDATION:
Clinical correlation recommended. Consider surgical consultation for symptomatic cholelithiasis.`, 
              is_abnormal: true 
            }
          ]
        },
        {
          parameter_name: "Gallstones Present",
          parameter_code: "gallstones_present",
          parameter_unit: "",
          data_type: "boolean",
          reference_range: {},
          data_points: [
            { date: "2025-03-25T10:00:00Z", value: true, is_abnormal: true }
          ]
        },
        {
          parameter_name: "Liver Size",
          parameter_code: "liver_size",
          parameter_unit: "cm",
          data_type: "numeric",
          reference_range: { min: 12, max: 16 },
          data_points: [
            { date: "2025-03-25T10:00:00Z", value: 14.2, is_abnormal: false }
          ]
        }
      ]
    },
    {
      test_type: {
        id: "blood-type-1",
        name: "Blood Type",
        code: "BLOOD_TYPE",
        description: "ABO and Rh blood group determination",
        category: "Hematology"
      },
      parameters: [
        {
          parameter_name: "ABO Group",
          parameter_code: "abo_group",
          parameter_unit: "",
          data_type: "categorical",
          reference_range: { 
            possible_values: ["A", "B", "AB", "O"]
          },
          data_points: [
            { date: "2024-06-10T10:00:00Z", value: "O", is_abnormal: false }
          ]
        },
        {
          parameter_name: "Rh Factor",
          parameter_code: "rh_factor",
          parameter_unit: "",
          data_type: "categorical",
          reference_range: { 
            possible_values: ["Positive", "Negative"]
          },
          data_points: [
            { date: "2024-06-10T10:00:00Z", value: "Positive", is_abnormal: false }
          ]
        }
      ]
    }
  ];

  const toggleLoading = () => {
    setIsLoading(!isLoading);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Test Result Example</h1>
      <p className="mb-4 text-gray-600">
        This example demonstrates the generic test result component displaying data for various test types.
      </p>
      
      <button
        onClick={toggleLoading}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {isLoading ? 'Show Results' : 'Simulate Loading'}
      </button>
      
      <GenericTestResult 
        testResults={exampleTestResults} 
        isLoading={isLoading}
        error={null}
      />
    </div>
  );
};

export default TestResultExample;