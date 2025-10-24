import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Skeleton } from "@heroui/skeleton";
import React from "react";

export const BankAccountDetailsSkeleton: React.FC = () => {
  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <Skeleton className="rounded-md">
            <div className="h-6 w-6 rounded-md bg-default-200" />
          </Skeleton>
          <Skeleton className="rounded-lg">
            <div className="h-6 w-32 rounded-lg bg-default-200" />
          </Skeleton>
        </div>
        <Skeleton className="rounded-full">
          <div className="h-6 w-20 rounded-full bg-default-200" />
        </Skeleton>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Skeleton className="rounded-lg mb-2">
                <div className="h-4 w-32 rounded-lg bg-default-200" />
              </Skeleton>

              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="rounded-md">
                  <div className="h-10 w-10 rounded-md bg-default-200" />
                </Skeleton>
                <div className="space-y-2">
                  <Skeleton className="rounded-lg">
                    <div className="h-5 w-40 rounded-lg bg-default-200" />
                  </Skeleton>
                  <Skeleton className="rounded-lg">
                    <div className="h-4 w-24 rounded-lg bg-default-200" />
                  </Skeleton>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Skeleton className="rounded-lg">
                    <div className="h-3 w-24 rounded-lg bg-default-200" />
                  </Skeleton>
                  <Skeleton className="rounded-lg">
                    <div className="h-5 w-20 rounded-lg bg-default-200" />
                  </Skeleton>
                </div>
                <div className="space-y-2">
                  <Skeleton className="rounded-lg">
                    <div className="h-3 w-24 rounded-lg bg-default-200" />
                  </Skeleton>
                  <Skeleton className="rounded-lg">
                    <div className="h-5 w-28 rounded-lg bg-default-200" />
                  </Skeleton>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Skeleton className="rounded-lg mb-2">
                <div className="h-4 w-32 rounded-lg bg-default-200" />
              </Skeleton>

              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <React.Fragment key={item}>
                    <div className="flex items-center justify-between">
                      <Skeleton className="rounded-lg">
                        <div className="h-4 w-24 rounded-lg bg-default-200" />
                      </Skeleton>
                      <Skeleton className="rounded-lg">
                        <div className="h-5 w-28 rounded-lg bg-default-200" />
                      </Skeleton>
                    </div>
                    {item < 3 && <Divider className="my-2" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};