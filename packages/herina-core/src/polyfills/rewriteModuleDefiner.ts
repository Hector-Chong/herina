declare var __d: (...args: any[]) => any;

const definerReference = __d;
const modules = global.__c();

__d = (...args) => {
  const moduleId = args[1];
  const module = modules[moduleId];

  if (module) {
    modules[moduleId] = null;
    definerReference.apply(null, args);
    if (module.isInitialized) {
      global.__r(moduleId);
    }
  } else {
    definerReference.apply(null, args);
  }
};

(global as any).modules = modules;
