# MonoLISA

## Frontend layers
- User Interface
- Data Access
- Implementations

### General frontend-layer guidelines
- May not depend on backend layers.

### User Interface Layer
- May not depend on the other layers.

### Data Access Layer
- May not depend on the other layers.

### Implementations Layer
- May depend on the Data Access and UI layers.

## BFF layers
- API Layer
- Services Layer
- Integration Layer

### General BFF-layer guidelines
- May not depend on frontend layers.

### API Layer
- May only depend on the Services Layer.
- Should not define its own data models, but use those defined in the Services Layer.

### Services Layer
- May only depend on the Integration Layer.
- Should define data models.

### Integration Layer
- May not depend on the other layers.