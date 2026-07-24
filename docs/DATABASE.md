# Database Schema Documentation

## Users Collection
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | Unique identifier |
| name | String | Yes | Full name (max 100 chars) |
| email | String | Yes, unique | Email address |
| password | String | Yes | Brypted password (select: false) |
| role | String | Yes | 'admin' or 'member' (default: member) |
| status | String | Yes | 'active', 'inactive', 'disabled' (default: active) |
| avatar | String | No | Avatar URL |
| phone | String | No | Phone number |
| resetPasswordToken | String | No | Password reset token |
| resetPasswordExpire | Date | No | Reset token expiry |
| createdAt | Date | Auto | Document creation time |
| updatedAt | Date | Auto | Last update time |

## Leads Collection
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | Unique identifier |
| name | String | Yes | Lead name (max 200 chars) |
| email | String | No | Contact email |
| phone | String | No | Contact phone |
| company | String | No | Company name |
| status | String | Yes | Pipeline status (default: new) |
| priority | String | Yes | low/medium/high/urgent (default: medium) |
| source | String | Yes | Lead source (default: website) |
| assignedTo | ObjectId | No | Reference to User |
| budget | Number | No | Budget amount (min: 0) |
| industry | String | No | Industry |
| country | String | No | Country |
| city | String | No | City |
| address | String | No | Address |
| website | String | No | Website URL |
| description | String | No | Description |
| tags | [String] | No | Tags array |
| createdBy | ObjectId | Yes | Reference to User |
| isArchived | Boolean | Yes | Archive status (default: false) |
| createdAt | Date | Auto | Document creation time |
| updatedAt | Date | Auto | Last update time |

### Indexes
- Text index on: name, email, company, phone
- Single field indexes: status, assignedTo, createdBy, createdAt, priority, source

## Notes Collection
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | Unique identifier |
| leadId | ObjectId | Yes | Reference to Lead |
| userId | ObjectId | Yes | Reference to User |
| message | String | Yes | Note content |
| createdAt | Date | Auto | Document creation time |
| updatedAt | Date | Auto | Last update time |

### Indexes
- leadId, userId

## Activities Collection
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | Unique identifier |
| leadId | ObjectId | Yes | Reference to Lead |
| action | String | Yes | Activity type enum |
| performedBy | ObjectId | Yes | Reference to User |
| details | String | No | Activity description |
| oldValue | String | No | Previous value |
| newValue | String | No | New value |
| createdAt | Date | Auto | Document creation time |

### Indexes
- leadId, performedBy, createdAt

## Lead Status Flow
```
New → Contacted → Qualified → Proposal Sent → Negotiation → Won
                                                        → Lost
                                        → Archived (from any status)
```
