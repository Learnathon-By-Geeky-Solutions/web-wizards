from django.core.management.base import BaseCommand
from django.db import transaction
from apps.medical_records.models.test_parameters import TestType, ParameterDefinition


class Command(BaseCommand):
    help = 'Initialize test types and parameters for the flexible test parameter system'

    def handle(self, *args, **options):
        self.stdout.write('Initializing test types and parameters...')

        with transaction.atomic():
            self.create_cbc_test_type()
            self.create_ure_test_type()
            # Add more test types as needed

        self.stdout.write(self.style.SUCCESS('Successfully initialized test types and parameters'))

    def create_cbc_test_type(self):
        """Creates CBC test type and its parameters"""
        # Create CBC test type
        cbc_test, created = TestType.objects.get_or_create(
            code="CBC",
            defaults={
                "name": "Complete Blood Count",
                "description": "Measures levels of red blood cells, white blood cells, platelets, and hemoglobin",
                "category": "Hematology"
            }
        )
        
        if created:
            self.stdout.write(f'Created test type: {cbc_test.name}')
        else:
            self.stdout.write(f'Test type already exists: {cbc_test.name}')
        
        # Create CBC parameters
        cbc_parameters = [
            # Red blood cell parameters
            {
                "code": "HGB",
                "name": "Hemoglobin",
                "unit": "g/dL",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {
                    "male": {"min": 13.5, "max": 17.5},
                    "female": {"min": 12.0, "max": 15.5}
                }
            },
            {
                "code": "HCT",
                "name": "Hematocrit",
                "unit": "%",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {
                    "male": {"min": 41, "max": 50},
                    "female": {"min": 36, "max": 48}
                }
            },
            {
                "code": "RBC",
                "name": "Red Blood Cells",
                "unit": "10^6/μL",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {
                    "male": {"min": 4.5, "max": 5.9},
                    "female": {"min": 4.0, "max": 5.2}
                }
            },
            {
                "code": "MCV",
                "name": "Mean Corpuscular Volume",
                "unit": "fL",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {"min": 80, "max": 100}
            },
            {
                "code": "MCH",
                "name": "Mean Corpuscular Hemoglobin",
                "unit": "pg",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {"min": 27, "max": 34}
            },
            {
                "code": "MCHC",
                "name": "Mean Corpuscular Hemoglobin Concentration",
                "unit": "g/dL",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {"min": 32, "max": 36}
            },
            {
                "code": "RDW",
                "name": "Red Cell Distribution Width",
                "unit": "%",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {"min": 11.5, "max": 14.5}
            },
            
            # White blood cell parameters
            {
                "code": "WBC",
                "name": "White Blood Cells",
                "unit": "10^3/μL",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {"min": 4.5, "max": 11.0}
            },
            {
                "code": "NEUT_P",
                "name": "Neutrophils Percentage",
                "unit": "%",
                "data_type": "numeric",
                "min_value": 0,
                "max_value": 100,
                "reference_range_json": {"min": 40, "max": 70}
            },
            {
                "code": "LYMPH_P",
                "name": "Lymphocytes Percentage",
                "unit": "%",
                "data_type": "numeric",
                "min_value": 0,
                "max_value": 100,
                "reference_range_json": {"min": 20, "max": 40}
            },
            {
                "code": "MONO_P",
                "name": "Monocytes Percentage",
                "unit": "%",
                "data_type": "numeric",
                "min_value": 0,
                "max_value": 100,
                "reference_range_json": {"min": 2, "max": 10}
            },
            {
                "code": "EO_P",
                "name": "Eosinophils Percentage",
                "unit": "%",
                "data_type": "numeric",
                "min_value": 0,
                "max_value": 100,
                "reference_range_json": {"min": 1, "max": 6}
            },
            {
                "code": "BASO_P",
                "name": "Basophils Percentage",
                "unit": "%",
                "data_type": "numeric",
                "min_value": 0,
                "max_value": 100,
                "reference_range_json": {"min": 0, "max": 2}
            },
            
            # Absolute counts
            {
                "code": "NEUT_A",
                "name": "Neutrophils Absolute",
                "unit": "10^3/μL",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {"min": 1.8, "max": 7.5}
            },
            {
                "code": "LYMPH_A",
                "name": "Lymphocytes Absolute",
                "unit": "10^3/μL",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {"min": 1.0, "max": 4.0}
            },
            {
                "code": "MONO_A",
                "name": "Monocytes Absolute",
                "unit": "10^3/μL",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {"min": 0.2, "max": 0.9}
            },
            {
                "code": "EO_A",
                "name": "Eosinophils Absolute",
                "unit": "10^3/μL",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {"min": 0.0, "max": 0.5}
            },
            {
                "code": "BASO_A",
                "name": "Basophils Absolute",
                "unit": "10^3/μL",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {"min": 0.0, "max": 0.2}
            },
            
            # Platelet parameters
            {
                "code": "PLT",
                "name": "Platelets",
                "unit": "10^3/μL",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {"min": 150, "max": 450}
            },
            {
                "code": "MPV",
                "name": "Mean Platelet Volume",
                "unit": "fL",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {"min": 7.5, "max": 12.0}
            }
        ]
        
        # Create each parameter and associate with CBC test type
        for param_data in cbc_parameters:
            param, created = ParameterDefinition.objects.get_or_create(
                code=param_data["code"],
                defaults={
                    "name": param_data["name"],
                    "unit": param_data["unit"],
                    "data_type": param_data["data_type"],
                    "min_value": param_data.get("min_value"),
                    "max_value": param_data.get("max_value"),
                    "reference_range_json": param_data["reference_range_json"]
                }
            )
            param.test_types.add(cbc_test)
            
            if created:
                self.stdout.write(f'  - Created parameter: {param.name}')

    def create_ure_test_type(self):
        """Creates URE test type and its parameters"""
        # Create URE test type
        ure_test, created = TestType.objects.get_or_create(
            code="URE",
            defaults={
                "name": "Urea and Electrolytes",
                "description": "Measures kidney function and electrolyte levels",
                "category": "Chemistry"
            }
        )
        
        if created:
            self.stdout.write(f'Created test type: {ure_test.name}')
        else:
            self.stdout.write(f'Test type already exists: {ure_test.name}')
        
        # Create URE parameters
        ure_parameters = [
            {
                "code": "NA",
                "name": "Sodium",
                "unit": "mmol/L",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {"min": 135, "max": 145}
            },
            {
                "code": "K",
                "name": "Potassium",
                "unit": "mmol/L",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {"min": 3.5, "max": 5.0}
            },
            {
                "code": "CL",
                "name": "Chloride",
                "unit": "mmol/L",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {"min": 98, "max": 106}
            },
            {
                "code": "HCO3",
                "name": "Bicarbonate",
                "unit": "mmol/L",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {"min": 22, "max": 29}
            },
            {
                "code": "UREA",
                "name": "Urea",
                "unit": "mmol/L",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {"min": 2.5, "max": 7.1}
            },
            {
                "code": "CREAT",
                "name": "Creatinine",
                "unit": "μmol/L",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {"male": {"min": 62, "max": 106}, "female": {"min": 44, "max": 80}}
            },
            {
                "code": "EGFR",
                "name": "eGFR",
                "unit": "mL/min/1.73m²",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {"min": 90, "max": 120}
            },
            {
                "code": "CA",
                "name": "Calcium",
                "unit": "mmol/L",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {"min": 2.2, "max": 2.6}
            },
            {
                "code": "PHOS",
                "name": "Phosphate",
                "unit": "mmol/L",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {"min": 0.8, "max": 1.5}
            },
            {
                "code": "MG",
                "name": "Magnesium",
                "unit": "mmol/L",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {"min": 0.7, "max": 1.0}
            },
            {
                "code": "UA",
                "name": "Uric Acid",
                "unit": "μmol/L",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {"male": {"min": 200, "max": 430}, "female": {"min": 140, "max": 360}}
            },
            {
                "code": "GLU",
                "name": "Glucose",
                "unit": "mmol/L",
                "data_type": "numeric",
                "min_value": 0,
                "reference_range_json": {"min": 3.9, "max": 5.8}
            }
        ]
        
        # Create each parameter and associate with URE test type
        for param_data in ure_parameters:
            param, created = ParameterDefinition.objects.get_or_create(
                code=param_data["code"],
                defaults={
                    "name": param_data["name"],
                    "unit": param_data["unit"],
                    "data_type": param_data["data_type"],
                    "min_value": param_data.get("min_value"),
                    "max_value": param_data.get("max_value"),
                    "reference_range_json": param_data["reference_range_json"]
                }
            )
            param.test_types.add(ure_test)
            
            if created:
                self.stdout.write(f'  - Created parameter: {param.name}')