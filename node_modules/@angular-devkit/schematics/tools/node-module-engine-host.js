"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeModulesEngineHost = exports.NodePackageDoesNotSupportSchematics = void 0;
const core_1 = require("@angular-devkit/core");
const path_1 = require("path");
const export_ref_1 = require("./export-ref");
const file_system_engine_host_base_1 = require("./file-system-engine-host-base");
const file_system_utility_1 = require("./file-system-utility");
class NodePackageDoesNotSupportSchematics extends core_1.BaseException {
    constructor(name) {
        super(`Package ${JSON.stringify(name)} was found but does not support schematics.`);
    }
}
exports.NodePackageDoesNotSupportSchematics = NodePackageDoesNotSupportSchematics;
/**
 * A simple EngineHost that uses NodeModules to resolve collections.
 */
class NodeModulesEngineHost extends file_system_engine_host_base_1.FileSystemEngineHostBase {
    constructor(paths) {
        super();
        this.paths = paths;
    }
    resolve(name, requester, references = new Set()) {
        if (requester) {
            if (references.has(requester)) {
                references.add(requester);
                throw new Error('Circular schematic reference detected: ' + JSON.stringify(Array.from(references)));
            }
            else {
                references.add(requester);
            }
        }
        const relativeBase = requester ? (0, path_1.dirname)(requester) : process.cwd();
        let collectionPath = undefined;
        if (name.startsWith('.')) {
            name = (0, path_1.resolve)(relativeBase, name);
        }
        const resolveOptions = {
            paths: requester ? [(0, path_1.dirname)(requester), ...(this.paths || [])] : this.paths,
        };
        // Try to resolve as a package
        try {
            const packageJsonPath = require.resolve((0, path_1.join)(name, 'package.json'), resolveOptions);
            const { schematics } = require(packageJsonPath);
            if (!schematics || typeof schematics !== 'string') {
                throw new NodePackageDoesNotSupportSchematics(name);
            }
            collectionPath = this.resolve(schematics, packageJsonPath, references);
        }
        catch (e) {
            if (e.code !== 'MODULE_NOT_FOUND') {
                throw e;
            }
        }
        // If not a package, try to resolve as a file
        if (!collectionPath) {
            try {
                collectionPath = require.resolve(name, resolveOptions);
            }
            catch (e) {
                if (e.code !== 'MODULE_NOT_FOUND') {
                    throw e;
                }
            }
        }
        // If not a package or a file, error
        if (!collectionPath) {
            throw new file_system_engine_host_base_1.CollectionCannotBeResolvedException(name);
        }
        return collectionPath;
    }
    _resolveCollectionPath(name, requester) {
        const collectionPath = this.resolve(name, requester);
        (0, file_system_utility_1.readJsonFile)(collectionPath);
        return collectionPath;
    }
    _resolveReferenceString(refString, parentPath, collectionDescription) {
        const ref = new export_ref_1.ExportStringRef(refString, parentPath);
        if (!ref.ref) {
            return null;
        }
        return { ref: ref.ref, path: ref.module };
    }
    _transformCollectionDescription(name, desc) {
        if (!desc.schematics || typeof desc.schematics != 'object') {
            throw new file_system_engine_host_base_1.CollectionMissingSchematicsMapException(name);
        }
        return {
            ...desc,
            name,
        };
    }
    _transformSchematicDescription(name, _collection, desc) {
        if (!desc.factoryFn || !desc.path || !desc.description) {
            throw new file_system_engine_host_base_1.SchematicMissingFieldsException(name);
        }
        return desc;
    }
}
exports.NodeModulesEngineHost = NodeModulesEngineHost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1tb2R1bGUtZW5naW5lLWhvc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3Rvb2xzL25vZGUtbW9kdWxlLWVuZ2luZS1ob3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILCtDQUFxRDtBQUNyRCwrQkFBOEM7QUFHOUMsNkNBQStDO0FBQy9DLGlGQUt3QztBQUN4QywrREFBcUQ7QUFFckQsTUFBYSxtQ0FBb0MsU0FBUSxvQkFBYTtJQUNwRSxZQUFZLElBQVk7UUFDdEIsS0FBSyxDQUFDLFdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsNkNBQTZDLENBQUMsQ0FBQztJQUN0RixDQUFDO0NBQ0Y7QUFKRCxrRkFJQztBQUVEOztHQUVHO0FBQ0gsTUFBYSxxQkFBc0IsU0FBUSx1REFBd0I7SUFDakUsWUFBNkIsS0FBZ0I7UUFDM0MsS0FBSyxFQUFFLENBQUM7UUFEbUIsVUFBSyxHQUFMLEtBQUssQ0FBVztJQUU3QyxDQUFDO0lBRU8sT0FBTyxDQUFDLElBQVksRUFBRSxTQUFrQixFQUFFLGFBQWEsSUFBSSxHQUFHLEVBQVU7UUFDOUUsSUFBSSxTQUFTLEVBQUU7WUFDYixJQUFJLFVBQVUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQzdCLFVBQVUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzFCLE1BQU0sSUFBSSxLQUFLLENBQ2IseUNBQXlDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQ25GLENBQUM7YUFDSDtpQkFBTTtnQkFDTCxVQUFVLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQzNCO1NBQ0Y7UUFFRCxNQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFD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aEMsQ0FBQztJQUVTLDhCQUE4QixDQUN0QyxJQUFZLEVBQ1osV0FBcUMsRUFDckMsSUFBc0M7UUFFdEMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUN0RCxNQUFNLElBQUksOERBQStCLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDakQ7UUFFRCxPQUFPLElBQStCLENBQUM7SUFDekMsQ0FBQztDQUNGO0FBNUdELHNEQTRHQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgeyBCYXNlRXhjZXB0aW9uIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgZGlybmFtZSwgam9pbiwgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgUnVsZUZhY3RvcnkgfSBmcm9tICcuLi9zcmMnO1xuaW1wb3J0IHsgRmlsZVN5c3RlbUNvbGxlY3Rpb25EZXNjLCBGaWxlU3lzdGVtU2NoZW1hdGljRGVzYyB9IGZyb20gJy4vZGVzY3JpcHRpb24nO1xuaW1wb3J0IHsgRXhwb3J0U3RyaW5nUmVmIH0gZnJvbSAnLi9leHBvcnQtcmVmJztcbmltcG9ydCB7XG4gIENvbGxlY3Rpb25DYW5ub3RCZVJlc29sdmVkRXhjZXB0aW9uLFxuICBDb2xsZWN0aW9uTWlzc2luZ1NjaGVtYXRpY3NNYXBFeGNlcHRpb24sXG4gIEZpbGVTeXN0ZW1FbmdpbmVIb3N0QmFzZSxcbiAgU2NoZW1hdGljTWlzc2luZ0ZpZWxkc0V4Y2VwdGlvbixcbn0gZnJvbSAnLi9maWxlLXN5c3RlbS1lbmdpbmUtaG9zdC1iYXNlJztcbmltcG9ydCB7IHJlYWRKc29uRmlsZSB9IGZyb20gJy4vZmlsZS1zeXN0ZW0tdXRpbGl0eSc7XG5cbmV4cG9ydCBjbGFzcyBOb2RlUGFja2FnZURvZXNOb3RTdXBwb3J0U2NoZW1hdGljcyBleHRlbmRzIEJhc2VFeGNlcHRpb24ge1xuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcpIHtcbiAgICBzdXBlcihgUGFja2FnZSAke0pTT04uc3RyaW5naWZ5KG5hbWUpfSB3YXMgZm91bmQgYnV0IGRvZXMgbm90IHN1cHBvcnQgc2NoZW1hdGljcy5gKTtcbiAgfVxufVxuXG4vKipcbiAqIEEgc2ltcGxlIEVuZ2luZUhvc3QgdGhhdCB1c2VzIE5vZGVNb2R1bGVzIHRvIHJlc29sdmUgY29sbGVjdGlvbnMuXG4gKi9cbmV4cG9ydCBjbGFzcyBOb2RlTW9kdWxlc0VuZ2luZUhvc3QgZXh0ZW5kcyBGaWxlU3lzdGVtRW5naW5lSG9zdEJhc2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHBhdGhzPzogc3RyaW5nW10pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHJpdmF0ZSByZXNvbHZlKG5hbWU6IHN0cmluZywgcmVxdWVzdGVyPzogc3RyaW5nLCByZWZlcmVuY2VzID0gbmV3IFNldDxzdHJpbmc+KCkpOiBzdHJpbmcge1xuICAgIGlmIChyZXF1ZXN0ZXIpIHtcbiAgICAgIGlmIChyZWZlcmVuY2VzLmhhcyhyZXF1ZXN0ZXIpKSB7XG4gICAgICAgIHJlZmVyZW5jZXMuYWRkKHJlcXVlc3Rlcik7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnQ2lyY3VsYXIgc2NoZW1hdGljIHJlZmVyZW5jZSBkZXRlY3RlZDogJyArIEpTT04uc3RyaW5naWZ5KEFycmF5LmZyb20ocmVmZXJlbmNlcykpLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVmZXJlbmNlcy5hZGQocmVxdWVzdGVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCByZWxhdGl2ZUJhc2UgPSByZXF1ZXN0ZXIgPyBkaXJuYW1lKHJlcXVlc3RlcikgOiBwcm9jZXNzLmN3ZCgpO1xuICAgIGxldCBjb2xsZWN0aW9uUGF0aDogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKG5hbWUuc3RhcnRzV2l0aCgnLicpKSB7XG4gICAgICBuYW1lID0gcmVzb2x2ZShyZWxhdGl2ZUJhc2UsIG5hbWUpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc29sdmVPcHRpb25zID0ge1xuICAgICAgcGF0aHM6IHJlcXVlc3RlciA/IFtkaXJuYW1lKHJlcXVlc3RlciksIC4uLih0aGlzLnBhdGhzIHx8IFtdKV0gOiB0aGlzLnBhdGhzLFxuICAgIH07XG5cbiAgICAvLyBUcnkgdG8gcmVzb2x2ZSBhcyBhIHBhY2thZ2VcbiAgICB0cnkge1xuICAgICAgY29uc3QgcGFja2FnZUpzb25QYXRoID0gcmVxdWlyZS5yZXNvbHZlKGpvaW4obmFtZSwgJ3BhY2thZ2UuanNvbicpLCByZXNvbHZlT3B0aW9ucyk7XG4gICAgICBjb25zdCB7IHNjaGVtYXRpY3MgfSA9IHJlcXVpcmUocGFja2FnZUpzb25QYXRoKTtcblxuICAgICAgaWYgKCFzY2hlbWF0aWNzIHx8IHR5cGVvZiBzY2hlbWF0aWNzICE9PSAnc3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgTm9kZVBhY2thZ2VEb2VzTm90U3VwcG9ydFNjaGVtYXRpY3MobmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGNvbGxlY3Rpb25QYXRoID0gdGhpcy5yZXNvbHZlKHNjaGVtYXRpY3MsIHBhY2thZ2VKc29uUGF0aCwgcmVmZXJlbmNlcyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKChlIGFzIE5vZGVKUy5FcnJub0V4Y2VwdGlvbikuY29kZSAhPT0gJ01PRFVMRV9OT1RfRk9VTkQnKSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgbm90IGEgcGFja2FnZSwgdHJ5IHRvIHJlc29sdmUgYXMgYSBmaWxlXG4gICAgaWYgKCFjb2xsZWN0aW9uUGF0aCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29sbGVjdGlvblBhdGggPSByZXF1aXJlLnJlc29sdmUobmFtZSwgcmVzb2x2ZU9wdGlvbnMpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoKGUgYXMgTm9kZUpTLkVycm5vRXhjZXB0aW9uKS5jb2RlICE9PSAnTU9EVUxFX05PVF9GT1VORCcpIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgbm90IGEgcGFja2FnZSBvciBhIGZpbGUsIGVycm9yXG4gICAgaWYgKCFjb2xsZWN0aW9uUGF0aCkge1xuICAgICAgdGhyb3cgbmV3IENvbGxlY3Rpb25DYW5ub3RCZVJlc29sdmVkRXhjZXB0aW9uKG5hbWUpO1xuICAgIH1cblxuICAgIHJldHVybiBjb2xsZWN0aW9uUGF0aDtcbiAgfVxuXG4gIHByb3RlY3RlZCBfcmVzb2x2ZUNvbGxlY3Rpb25QYXRoKG5hbWU6IHN0cmluZywgcmVxdWVzdGVyPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBjb2xsZWN0aW9uUGF0aCA9IHRoaXMucmVzb2x2ZShuYW1lLCByZXF1ZXN0ZXIpO1xuICAgIHJlYWRKc29uRmlsZShjb2xsZWN0aW9uUGF0aCk7XG5cbiAgICByZXR1cm4gY29sbGVjdGlvblBhdGg7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3Jlc29sdmVSZWZlcmVuY2VTdHJpbmcoXG4gICAgcmVmU3RyaW5nOiBzdHJpbmcsXG4gICAgcGFyZW50UGF0aDogc3RyaW5nLFxuICAgIGNvbGxlY3Rpb25EZXNjcmlwdGlvbj86IEZpbGVTeXN0ZW1Db2xsZWN0aW9uRGVzYyxcbiAgKSB7XG4gICAgY29uc3QgcmVmID0gbmV3IEV4cG9ydFN0cmluZ1JlZjxSdWxlRmFjdG9yeTx7fT4+KHJlZlN0cmluZywgcGFyZW50UGF0aCk7XG4gICAgaWYgKCFyZWYucmVmKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4geyByZWY6IHJlZi5yZWYsIHBhdGg6IHJlZi5tb2R1bGUgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfdHJhbnNmb3JtQ29sbGVjdGlvbkRlc2NyaXB0aW9uKFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBkZXNjOiBQYXJ0aWFsPEZpbGVTeXN0ZW1Db2xsZWN0aW9uRGVzYz4sXG4gICk6IEZpbGVTeXN0ZW1Db2xsZWN0aW9uRGVzYyB7XG4gICAgaWYgKCFkZXNjLnNjaGVtYXRpY3MgfHwgdHlwZW9mIGRlc2Muc2NoZW1hdGljcyAhPSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IENvbGxlY3Rpb25NaXNzaW5nU2NoZW1hdGljc01hcEV4Y2VwdGlvbihuYW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uZGVzYyxcbiAgICAgIG5hbWUsXG4gICAgfSBhcyBGaWxlU3lzdGVtQ29sbGVjdGlvbkRlc2M7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3RyYW5zZm9ybVNjaGVtYXRpY0Rlc2NyaXB0aW9uKFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBfY29sbGVjdGlvbjogRmlsZVN5c3RlbUNvbGxlY3Rpb25EZXNjLFxuICAgIGRlc2M6IFBhcnRpYWw8RmlsZVN5c3RlbVNjaGVtYXRpY0Rlc2M+LFxuICApOiBGaWxlU3lzdGVtU2NoZW1hdGljRGVzYyB7XG4gICAgaWYgKCFkZXNjLmZhY3RvcnlGbiB8fCAhZGVzYy5wYXRoIHx8ICFkZXNjLmRlc2NyaXB0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljTWlzc2luZ0ZpZWxkc0V4Y2VwdGlvbihuYW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGVzYyBhcyBGaWxlU3lzdGVtU2NoZW1hdGljRGVzYztcbiAgfVxufVxuIl19