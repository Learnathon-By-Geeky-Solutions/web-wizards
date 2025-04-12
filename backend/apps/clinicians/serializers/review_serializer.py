from rest_framework import serializers
from ..models.review import Review
from ..models.clinician import Clinician
from ..models.diagnostic_center import DiagnosticCenter
from apps.users.serializers.user_serializer import UserDetailSerializer

class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for the Review model"""
    user_details = UserDetailSerializer(source='user', read_only=True)
    
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ('user',)
        
    def validate(self, data):
        """
        Check that review is for either clinician or diagnostic center, not both.
        """
        clinician = data.get('clinician')
        diagnostic_center = data.get('diagnostic_center')
        
        if clinician and diagnostic_center:
            raise serializers.ValidationError("A review can only be for a clinician or a diagnostic center, not both.")
        if not clinician and not diagnostic_center:
            raise serializers.ValidationError("A review must be for either a clinician or a diagnostic center.")
            
        return data
        
    def create(self, validated_data):
        """Set the user from the request context."""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)