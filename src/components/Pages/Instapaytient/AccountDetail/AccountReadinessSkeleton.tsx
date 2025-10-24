import { Card, CardBody, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import React from "react";

export const AccountReadinessSkeleton: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      {/* Affirm Capability Card Skeleton */}
      <Card className="md:col-span-1">
        <CardBody className="flex flex-col items-center justify-center py-6">
          <Skeleton className="rounded-full mb-3">
            <div className="h-16 w-16 rounded-full bg-default-200" />
          </Skeleton>
          <Skeleton className="rounded-lg mb-1">
            <div className="h-6 w-32 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="rounded-lg mb-3">
            <div className="h-4 w-20 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="rounded-full">
            <div className="h-6 w-16 rounded-full bg-default-200" />
          </Skeleton>
        </CardBody>
      </Card>

      {/* Ready To Go Live Card Skeleton */}
      <Card className="flex-row md:col-span-2">
        <CardBody className="flex flex-col items-center justify-center py-6">
          <Skeleton className="rounded-full mb-3">
            <div className="h-16 w-16 rounded-full bg-default-200" />
          </Skeleton>
          <Skeleton className="rounded-lg mb-1">
            <div className="h-6 w-32 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="rounded-lg mb-3">
            <div className="h-4 w-20 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="rounded-full">
            <div className="h-6 w-16 rounded-full bg-default-200" />
          </Skeleton>
        </CardBody>
        <CardBody className="flex flex-col justify-center">
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <Skeleton className="rounded-full">
                  <div className="h-6 w-6 rounded-full bg-default-200" />
                </Skeleton>
                <Skeleton className="rounded-lg">
                  <div className="h-5 w-full max-w-[250px] rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="rounded-lg mb-1">
                  <div className="h-6 w-32 rounded-lg bg-default-200" />
                </Skeleton>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};