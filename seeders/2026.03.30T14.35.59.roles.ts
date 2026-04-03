import { QueryInterface } from 'sequelize';
import { MigrationFn } from 'umzug';
import { v7 } from 'uuid';

type SequelizeMigration = MigrationFn<QueryInterface>;
const TABLE_NAME = 'role';

const now = new Date();

const roles = [
  {
    id: v7(),
    name: 'Citizen',
    slug: 'citizen',
    description: 'Default role for verified users',
    created_at: now,
    updated_at: now,
  },
  {
    id: v7(),
    name: 'Officer',
    slug: 'officer',
    description: 'Law enforcement officer',
    created_at: now,
    updated_at: now,
  },
  {
    id: v7(),
    name: 'Supervisor',
    slug: 'supervisor',
    description: 'Supervises officers and operations',
    created_at: now,
    updated_at: now,
  },
  {
    id: v7(),
    name: 'Admin',
    slug: 'admin',
    description: 'System administrator',
    created_at: now,
    updated_at: now,
  },
  {
    id: v7(),
    name: 'Super Admin',
    slug: 'super_admin',
    description: 'Full system access',
    created_at: now,
    updated_at: now,
  },
];

export const up: SequelizeMigration = async ({ context }) => {
  await context.bulkInsert(TABLE_NAME, roles);
};

export const down: SequelizeMigration = async ({ context }) => {
  await context.bulkDelete(TABLE_NAME, { slug: roles.map((r) => r.slug) });
};
