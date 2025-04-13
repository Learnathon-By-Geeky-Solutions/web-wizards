from django.core.management.base import BaseCommand
from django.db import transaction
from apps.medical_records.models.test_parameters import TestType, ParameterDefinition
import json

class Command(BaseCommand):
    help = 'Initialize test types and parameter definitions'

    def handle(self, *args, **options):
        self.stdout.write('Initializing test types and parameter definitions...')
        
        with transaction.atomic():
            # Create test types if they don't exist
            self._create_test_types()
            
            # Create parameters for each test type
            self._create_cbc_parameters()
            self._create_ure_parameters()
            self._create_lft_parameters()
            
        self.stdout.write(self.style.SUCCESS('Successfully initialized test types and parameters'))

    def _create_test_types(self):
        test_types = [
            {
                'code': 'CBC', 
                'name': 'Complete Blood Count', 
                'category': 'HEMATOLOGY',
                'description': 'Measures various components and features of blood'
            },
            {
                'code': 'URE', 
                'name': 'Urea and Electrolytes', 
                'category': 'BIOCHEMISTRY',
                'description': 'Measures kidney function and electrolyte levels'
            },
            {
                'code': 'LFT', 
                'name': 'Liver Function Test', 
                'category': 'BIOCHEMISTRY',
                'description': 'Assesses liver function through various biomarkers'
            },
            {
                'code': 'LIPID', 
                'name': 'Lipid Profile', 
                'category': 'BIOCHEMISTRY',
                'description': 'Measures different types of fats in the blood'
            },
            {
                'code': 'TFT', 
                'name': 'Thyroid Function Test', 
                'category': 'ENDOCRINOLOGY',
                'description': 'Measures thyroid hormone levels'
            },
            {
                'code': 'GLUCOSE', 
                'name': 'Glucose Test', 
                'category': 'BIOCHEMISTRY',
                'description': 'Measures blood glucose levels'
            },
            {
                'code': 'COAG', 
                'name': 'Coagulation Profile', 
                'category': 'HEMATOLOGY',
                'description': 'Assesses blood clotting function'
            },
            {
                'code': 'IRON', 
                'name': 'Iron Studies', 
                'category': 'BIOCHEMISTRY',
                'description': 'Measures iron levels and related markers'
            }
        ]
        
        for test_type_data in test_types:
            test_type, created = TestType.objects.update_or_create(
                code=test_type_data['code'],
                defaults=test_type_data
            )
            if created:
                self.stdout.write(f"Created test type: {test_type.name}")
            else:
                self.stdout.write(f"Updated test type: {test_type.name}")

    def _create_cbc_parameters(self):
        test_type = TestType.objects.get(code='CBC')
        
        parameters = [
            {
                'code': 'HGB',
                'name': 'Hemoglobin',
                'unit': 'g/dL',
                'data_type': 'NUMERIC',
                'reference_range_json': json.dumps({
                    'male': {'min': 13.5, 'max': 17.5},
                    'female': {'min': 12.0, 'max': 15.5},
                    'general': {'min': 12.0, 'max': 17.5}
                })
            },
            {
                'code': 'HCT',
                'name': 'Hematocrit',
                'unit': '%',
                'data_type': 'NUMERIC',
                'reference_range_json': json.dumps({
                    'male': {'min': 41.0, 'max': 50.0},
                    'female': {'min': 36.0, 'max': 46.0},
                    'general': {'min': 36.0, 'max': 50.0}
                })
            },
            {
                'code': 'RBC',
                'name': 'Red Blood Cell Count',
                'unit': 'x10^6/μL',
                'data_type': 'NUMERIC',
                'reference_range_json': json.dumps({
                    'male': {'min': 4.5, 'max': 5.9},
                    'female': {'min': 4.0, 'max': 5.2},
                    'general': {'min': 4.0, 'max': 5.9}
                })
            },
            {
                'code': 'WBC',
                'name': 'White Blood Cell Count',
                'unit': 'x10^3/μL',
                'data_type': 'NUMERIC',
                'reference_range_json': json.dumps({
                    'general': {'min': 4.0, 'max': 11.0}
                })
            },
            {
                'code': 'PLT',
                'name': 'Platelet Count',
                'unit': 'x10^3/μL',
                'data_type': 'NUMERIC',
                'reference_range_json': json.dumps({
                    'general': {'min': 150, 'max': 450}
                })
            },
            {
                'code': 'MCV',
                'name': 'Mean Corpuscular Volume',
                'unit': 'fL',
                'data_type': 'NUMERIC',
                'reference_range_json': json.dumps({
                    'general': {'min': 80, 'max': 100}
                })
            },
            {
                'code': 'MCH',
                'name': 'Mean Corpuscular Hemoglobin',
                'unit': 'pg',
                'data_type': 'NUMERIC',
                'reference_range_json': json.dumps({
                    'general': {'min': 27, 'max': 33}
                })
            },
            {
                'code': 'MCHC',
                'name': 'Mean Corpuscular Hemoglobin Concentration',
                'unit': 'g/dL',
                'data_type': 'NUMERIC',
                'reference_range_json': json.dumps({
                    'general': {'min': 32, 'max': 36}
                })
            }
        ]
        
        self._create_parameters(parameters, test_type)

    def _create_ure_parameters(self):
        test_type = TestType.objects.get(code='URE')
        
        parameters = [
            {
                'code': 'NA',
                'name': 'Sodium',
                'unit': 'mmol/L',
                'data_type': 'NUMERIC',
                'reference_range_json': json.dumps({
                    'general': {'min': 135, 'max': 145}
                })
            },
            {
                'code': 'K',
                'name': 'Potassium',
                'unit': 'mmol/L',
                'data_type': 'NUMERIC',
                'reference_range_json': json.dumps({
                    'general': {'min': 3.5, 'max': 5.0}
                })
            },
            {
                'code': 'CL',
                'name': 'Chloride',
                'unit': 'mmol/L',
                'data_type': 'NUMERIC',
                'reference_range_json': json.dumps({
                    'general': {'min': 98, 'max': 106}
                })
            },
            {
                'code': 'HCO3',
                'name': 'Bicarbonate',
                'unit': 'mmol/L',
                'data_type': 'NUMERIC',
                'reference_range_json': json.dumps({
                    'general': {'min': 22, 'max': 29}
                })
            },
            {
                'code': 'UREA',
                'name': 'Urea',
                'unit': 'mmol/L',
                'data_type': 'NUMERIC',
                'reference_range_json': json.dumps({
                    'general': {'min': 2.5, 'max': 7.8}
                })
            },
            {
                'code': 'CREAT',
                'name': 'Creatinine',
                'unit': 'μmol/L',
                'data_type': 'NUMERIC',
                'reference_range_json': json.dumps({
                    'male': {'min': 60, 'max': 110},
                    'female': {'min': 45, 'max': 90},
                    'general': {'min': 45, 'max': 110}
                })
            },
            {
                'code': 'EGFR',
                'name': 'Estimated Glomerular Filtration Rate',
                'unit': 'mL/min/1.73m²',
                'data_type': 'NUMERIC',
                'reference_range_json': json.dumps({
                    'general': {'min': 90, 'max': null}
                })
            }
        ]
        
        self._create_parameters(parameters, test_type)

    def _create_lft_parameters(self):
        test_type = TestType.objects.get(code='LFT')
        
        parameters = [
            {
                'code': 'ALB',
                'name': 'Albumin',
                'unit': 'g/L',
                'data_type': 'NUMERIC',
                'reference_range_json': json.dumps({
                    'general': {'min': 35, 'max': 50}
                })
            },
            {
                'code': 'TP',
                'name': 'Total Protein',
                'unit': 'g/L',
                'data_type': 'NUMERIC',
                'reference_range_json': json.dumps({
                    'general': {'min': 60, 'max': 80}
                })
            },
            {
                'code': 'BILI',
                'name': 'Total Bilirubin',
                'unit': 'μmol/L',
                'data_type': 'NUMERIC',
                'reference_range_json': json.dumps({
                    'general': {'min': 0, 'max': 21}
                })
            },
            {
                'code': 'ALP',
                'name': 'Alkaline Phosphatase',
                'unit': 'U/L',
                'data_type': 'NUMERIC',
                'reference_range_json': json.dumps({
                    'general': {'min': 30, 'max': 120}
                })
            },
            {
                'code': 'ALT',
                'name': 'Alanine Transaminase',
                'unit': 'U/L',
                'data_type': 'NUMERIC',
                'reference_range_json': json.dumps({
                    'male': {'min': 0, 'max': 45},
                    'female': {'min': 0, 'max': 35},
                    'general': {'min': 0, 'max': 45}
                })
            },
            {
                'code': 'AST',
                'name': 'Aspartate Transaminase',
                'unit': 'U/L',
                'data_type': 'NUMERIC',
                'reference_range_json': json.dumps({
                    'male': {'min': 0, 'max': 35},
                    'female': {'min': 0, 'max': 31},
                    'general': {'min': 0, 'max': 35}
                })
            },
            {
                'code': 'GGT',
                'name': 'Gamma-glutamyl Transferase',
                'unit': 'U/L',
                'data_type': 'NUMERIC',
                'reference_range_json': json.dumps({
                    'male': {'min': 10, 'max': 71},
                    'female': {'min': 6, 'max': 42},
                    'general': {'min': 6, 'max': 71}
                })
            }
        ]
        
        self._create_parameters(parameters, test_type)

    def _create_parameters(self, parameters_data, test_type):
        for param_data in parameters_data:
            param, created = ParameterDefinition.objects.update_or_create(
                code=param_data['code'],
                defaults={
                    'name': param_data['name'], 
                    'unit': param_data['unit'],
                    'data_type': param_data['data_type'],
                    'reference_range_json': param_data['reference_range_json']
                }
            )
            
            # Add the parameter to the test type if it's not already there
            if test_type not in param.test_types.all():
                param.test_types.add(test_type)
                
            if created:
                self.stdout.write(f"  Created parameter: {param.name}")
            else:
                self.stdout.write(f"  Updated parameter: {param.name}")