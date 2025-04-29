import React from 'react';
import TestTypePanel from './TestTypePanel';

// This is a demo component to showcase how text-based parameters like ultrasonography
// would be displayed in our unified visualization approach
const UltrasonographyDemo = () => {
  // Sample test type data for ultrasonography
  const ultrasonographyTestType = {
    id: 'ultra-demo-1',
    name: 'Abdominal Ultrasonography',
    code: 'ULTRA_ABD',
    description: 'Ultrasound imaging of the abdominal organs',
    category: 'Imaging'
  };

  // Sample parameters including the text-based ultrasound report
  const parameters = [
    // This is an example of a text-based test parameter (ultrasonography report)
    {
      id: 'ultra-param-1',
      parameter: 'ultra-param-1',
      parameter_name: 'Abdominal Ultrasound Report',
      parameter_code: 'ultra_report',
      parameter_unit: '',
      data_type: 'text',
      isTextParameter: true,
      reference_range: {},
      data_points: [
        { 
          date: '2025-03-25T10:00:00Z', 
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
        },
        { 
          date: '2024-09-15T10:30:00Z', 
          value: `ABDOMINAL ULTRASONOGRAPHY REPORT

EXAMINATION:
Complete abdominal ultrasound examination performed on 15/09/2024.

CLINICAL HISTORY:
Routine health checkup.

FINDINGS:
LIVER: Normal size and contour. No focal lesions identified.

GALLBLADDER: Well-distended with thin walls. No gallstones or sludge. No pericholecystic fluid.

BILIARY TREE: Common bile duct measures 4mm in diameter. No biliary dilation.

PANCREAS: Normal size and echotexture. No pancreatic duct dilation or focal lesions.

SPLEEN: Normal size (9.8 cm) and homogeneous echogenicity.

KIDNEYS: Both kidneys normal in size, shape, and position. No hydronephrosis, calculi, or masses.

URINARY BLADDER: Adequately distended. No wall thickening or intraluminal echoes.

IMPRESSION:
Normal complete abdominal ultrasound examination.

RECOMMENDATION:
No follow-up imaging required.`, 
          is_abnormal: false 
        }
      ]
    },
    // This is an example of a numeric parameter that might be recorded with the ultrasound
    {
      id: 'ultra-param-2',
      parameter: 'ultra-param-2',
      parameter_name: 'Liver Size',
      parameter_code: 'liver_size',
      parameter_unit: 'cm',
      reference_range: { min: 12, max: 16 },
      data_points: [
        { date: '2025-03-25T10:00:00Z', value: 14.2, is_abnormal: false },
        { date: '2024-09-15T10:30:00Z', value: 14.0, is_abnormal: false }
      ]
    }
  ];

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-4">Ultrasonography Demo</h2>
      <p className="mb-4 text-gray-600">
        This demonstrates how our unified test parameter visualization handles text-based 
        parameters like ultrasonography reports along with numeric measurements:
      </p>
      
      <div className="mt-6">
        <TestTypePanel 
          testType={ultrasonographyTestType}
          parameters={parameters}
          initialExpandedState={true}
        />
      </div>
    </div>
  );
};

export default UltrasonographyDemo;