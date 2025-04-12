from django.core.management.base import BaseCommand
from apps.medications.models.medication import Medication

class Command(BaseCommand):
    help = 'Loads sample medication data into the database'

    def handle(self, *args, **options):
        medications = [
            {
                'name': 'Paracetamol',
                'generic_name': 'Acetaminophen',
                'brand_name': 'Tylenol',
                'manufacturer': 'Johnson & Johnson',
                'description': 'Pain reliever and fever reducer',
                'dosage_form': 'tablet',
                'strength': '500',
                'unit': 'mg',
                'category': 'analgesic',
                'contraindications': 'Liver disease, alcoholism',
                'side_effects': 'Nausea, stomach pain, loss of appetite',
                'storage_instructions': 'Store at room temperature',
                'is_prescription_required': False
            },
            {
                'name': 'Amoxicillin',
                'generic_name': 'Amoxicillin',
                'brand_name': 'Amoxil',
                'manufacturer': 'GlaxoSmithKline',
                'description': 'Antibiotic used to treat bacterial infections',
                'dosage_form': 'capsule',
                'strength': '500',
                'unit': 'mg',
                'category': 'antibiotic',
                'contraindications': 'Allergy to penicillins',
                'side_effects': 'Diarrhea, nausea, rash',
                'storage_instructions': 'Store at room temperature',
                'is_prescription_required': True
            },
            {
                'name': 'Omeprazole',
                'generic_name': 'Omeprazole',
                'brand_name': 'Prilosec',
                'manufacturer': 'AstraZeneca',
                'description': 'Proton pump inhibitor for acid reflux and ulcers',
                'dosage_form': 'capsule',
                'strength': '20',
                'unit': 'mg',
                'category': 'other',
                'contraindications': 'Liver disease',
                'side_effects': 'Headache, stomach pain, diarrhea',
                'storage_instructions': 'Store at room temperature',
                'is_prescription_required': False
            },
            {
                'name': 'Metformin',
                'generic_name': 'Metformin hydrochloride',
                'brand_name': 'Glucophage',
                'manufacturer': 'Merck',
                'description': 'Oral diabetes medicine',
                'dosage_form': 'tablet',
                'strength': '500',
                'unit': 'mg',
                'category': 'antidiabetic',
                'contraindications': 'Kidney disease, heart problems',
                'side_effects': 'Nausea, diarrhea, decreased vitamin B-12',
                'storage_instructions': 'Store at room temperature',
                'is_prescription_required': True
            },
            {
                'name': 'Amlodipine',
                'generic_name': 'Amlodipine besylate',
                'brand_name': 'Norvasc',
                'manufacturer': 'Pfizer',
                'description': 'Calcium channel blocker for high blood pressure',
                'dosage_form': 'tablet',
                'strength': '5',
                'unit': 'mg',
                'category': 'antihypertensive',
                'contraindications': 'Liver disease, pregnancy',
                'side_effects': 'Dizziness, swelling, headache',
                'storage_instructions': 'Store at room temperature',
                'is_prescription_required': True
            },
            {
                'name': 'Vitamin D3',
                'generic_name': 'Cholecalciferol',
                'brand_name': 'Nature Made D3',
                'manufacturer': 'Nature Made',
                'description': 'Vitamin D supplement',
                'dosage_form': 'tablet',
                'strength': '1000',
                'unit': 'IU',
                'category': 'vitamin',
                'contraindications': 'High blood calcium',
                'side_effects': 'Kidney stones, high blood calcium',
                'storage_instructions': 'Store in a cool, dry place',
                'is_prescription_required': False
            },
            {
                'name': 'Cetirizine',
                'generic_name': 'Cetirizine hydrochloride',
                'brand_name': 'Zyrtec',
                'manufacturer': 'Johnson & Johnson',
                'description': 'Antihistamine for allergies',
                'dosage_form': 'tablet',
                'strength': '10',
                'unit': 'mg',
                'category': 'antihistamine',
                'contraindications': 'Kidney disease',
                'side_effects': 'Drowsiness, dry mouth',
                'storage_instructions': 'Store at room temperature',
                'is_prescription_required': False
            }
        ]

        created_count = 0
        updated_count = 0

        for med_data in medications:
            medication, created = Medication.objects.update_or_create(
                name=med_data['name'],
                defaults=med_data
            )
            if created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully loaded {created_count} new medications and updated {updated_count} existing ones'
            )
        )