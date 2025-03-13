import { SetMetadata } from '@nestjs/common';

export const RequierePermiso = (permiso: string) => SetMetadata('permiso', permiso);