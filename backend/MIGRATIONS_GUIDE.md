# Django Migrations Guide for Team Projects

This document outlines our team's approach to managing Django migrations to avoid conflicts when multiple team members are making model changes simultaneously.

## Migration Workflow

We use a dedicated `migrations` branch to manage all model changes and migrations in a coordinated way. This approach helps us avoid conflicts that can cause GitHub Actions to fail.

### Basic Workflow Steps

1. **Create model changes in the migrations branch**:
   ```bash
   # Switch to the migrations branch
   git checkout migrations
   
   # Make sure it's up to date
   git pull origin migrations
   
   # Make your model changes and create migrations
   python manage.py makemigrations
   
   # Test the migrations
   python manage.py migrate
   
   # Commit and push migrations
   git add .
   git commit -m "Add [feature] model changes and migrations"
   git push origin migrations
   ```

2. **Apply migrations to your feature branch**:
   ```bash
   # Switch to your feature branch
   git checkout feature/your-feature
   
   # Merge migrations from the migrations branch
   git merge migrations
   
   # Continue with your feature development
   ```

## Guidelines for Working with Migrations

1. **Never create migrations directly in feature branches** - Always use the migrations branch
2. **Communicate with the team** before making model changes to avoid conflicts
3. **Keep migrations small and focused** - Don't combine unrelated model changes
4. **Run tests after merging migrations** to ensure they work correctly
5. **Use descriptive commit messages** for migration commits

## Special Cases

### Docker Containers

Our Docker setup is configured to apply migrations without creating new ones:

```yaml
command: >
  sh -c "python /app/wait_for_db.py && 
         python manage.py migrate --no-input && 
         python manage.py runserver 0.0.0.0:8000"
```

### GitHub Actions

We have a GitHub Actions workflow that validates migrations on push to the migrations branch and on PRs that include migration files.

### Handling Migration Conflicts

If you encounter migration conflicts:

1. Stash your changes: `git stash`
2. Update the migrations branch: `git checkout migrations && git pull`
3. Switch back to your branch: `git checkout your-branch`
4. Apply your stashed changes: `git stash pop`
5. Resolve conflicts and create new migrations

## Migration Rules

1. **Migration names should be descriptive**: 
   ```bash
   python manage.py makemigrations app_name -n descriptive_name
   ```

2. **Squash migrations before major releases**:
   ```bash
   python manage.py squashmigrations app_name start_migration end_migration
   ```

3. **Test migrations before pushing**:
   ```bash
   python manage.py migrate --plan  # Check what will be applied
   python manage.py migrate  # Apply migrations
   ```

Remember: The goal is to keep the migration history linear and conflict-free!