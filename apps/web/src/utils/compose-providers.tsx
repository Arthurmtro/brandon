import { ReactNode, ComponentType } from 'react';

type ProviderComponent = ComponentType<{ children: ReactNode }>;

export const composeProviders = (providers: ProviderComponent[]) => {
  return ({ children }: { children: ReactNode }) => {
    return providers.reduceRight(
      (accumulatedChildren, Provider) => (
        <Provider>{accumulatedChildren}</Provider>
      ),
      children
    );
  };
};
